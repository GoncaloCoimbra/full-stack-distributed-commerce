import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';
import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyMultipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import { createServer } from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import { publishPortfolioEvent } from './redisClient';
import { ChatOpsEngine } from './chatOpsEngine';
import { prisma } from './prismaClient';
import { parseUserIdFromToken } from './auth';

const HTTP_PORT = Number(process.env.PORT || 3002);
const WS_PORT = Number(process.env.WS_PORT || 9001);
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const fastify = Fastify({ logger: false });
fastify.register(fastifyCors, {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
});
fastify.register(fastifyMultipart);
fastify.register(fastifyStatic, { root: UPLOAD_DIR, prefix: '/uploads/', decorateReply: false });

interface ChatMessage {
  id: string;
  tempId?: string;
  channelId: string;
  userId: string;
  text: string;
  ts: number;
  pending?: boolean;
  system?: boolean;
  fileUrl?: string;
  replyToId?: string;
}

interface FileRecord {
  id: string;
  name: string;
  url: string;
  size: number;
}

interface ConnectionMeta {
  userId: string;
  channelId?: string;
}

const activeConnections = new Map<string, Set<WebSocket>>();
const connectionMeta = new Map<WebSocket, ConnectionMeta>();
const messageHistory = new Map<string, ChatMessage[]>();
const channelFiles = new Map<string, FileRecord[]>([
  ['logistica', [
    { id: 'file-1', name: 'relatorio-de-estoque.pdf', url: '/uploads/relatorio-de-estoque.pdf', size: 154321 }
  ]],
]);

const TEAM_MEMBERS = [
  { id: 'goncalo', name: 'Gonçalo Oliveira' },
  { id: 'joao', name: 'João Silva' },
  { id: 'ana', name: 'Ana Costa' },
  { id: 'pedro', name: 'Pedro Martins' },
  { id: 'bot', name: 'ChatBot' },
];

const ensureChannel = async (channelId: string) => {
  if (messageHistory.has(channelId)) return;

  const existingChannel = await prisma.channel.findUnique({ where: { id: channelId } });
  if (!existingChannel) {
    await prisma.channel.create({ data: { id: channelId, name: channelId } });
  }

  const persistedMessages = await prisma.message.findMany({
    where: { channelId },
    orderBy: { createdAt: 'asc' },
    take: 200,
  });

  const history = persistedMessages.map((message) => ({
    id: message.id,
    channelId,
    userId: message.userId,
    text: message.text,
    ts: message.createdAt.getTime(),
    system: false,
  }));

  messageHistory.set(channelId, history.length > 0 ? history : [{
    id: `system-${channelId}-1`,
    channelId,
    userId: 'bot',
    text: `Bem-vindo ao canal ${channelId}. Use /stock ou /approve-credit para validar comandos ChatOps em tempo real.`,
    ts: Date.now(),
    system: true,
  }]);
};

const getChannelMembers = (channelId: string) => {
  const activeUsers = new Set(
    [...connectionMeta.values()]
      .filter((meta) => meta.channelId === channelId)
      .map((meta) => meta.userId)
  );

  return TEAM_MEMBERS.map((member) => ({
    ...member,
    online: activeUsers.has(member.id),
  }));
};

const addMessageToHistory = async (channelId: string, message: ChatMessage) => {
  await ensureChannel(channelId);
  const list = messageHistory.get(channelId)!;
  list.push(message);
  if (list.length > 200) list.shift();

  await prisma.message.create({
    data: {
      id: message.id,
      text: message.text,
      userId: message.userId,
      channelId,
    },
  });
};

const broadcastToChannel = (channelId: string, payload: any) => {
  const set = activeConnections.get(channelId);
  if (!set) return;
  const message = JSON.stringify(payload);
  for (const ws of set) {
    try { ws.send(message); } catch { /* ignore */ }
  }
};

const publishToChannel = (channelId: string, payload: any) => {
  void publishPortfolioEvent(`channel:${channelId}`, JSON.stringify(payload));
};

const registerConnection = (ws: WebSocket, channelId: string, userId: string) => {
  const set = activeConnections.get(channelId) || new Set<WebSocket>();
  set.add(ws);
  activeConnections.set(channelId, set);
  connectionMeta.set(ws, { userId, channelId });
  publishToChannel(channelId, {
    type: 'presence',
    channelId,
    members: getChannelMembers(channelId),
  });
};

const removeConnection = (ws: WebSocket) => {
  const meta = connectionMeta.get(ws);
  if (!meta || !meta.channelId) return;
  const set = activeConnections.get(meta.channelId);
  if (set) { set.delete(ws); }
  publishToChannel(meta.channelId, {
    type: 'presence',
    channelId: meta.channelId,
    members: getChannelMembers(meta.channelId),
  });
  connectionMeta.delete(ws);
};

fastify.get('/health', async () => ({ ok: true }));

fastify.get('/history', async (request, reply) => {
  const query = request.query as { channelId?: string; before?: string };
  const channelId = query.channelId;
  if (!channelId) return reply.code(400).send({ error: 'channelId is required' });
  await ensureChannel(channelId);
  const before = query.before ? Number(query.before) : undefined;
  const list = messageHistory.get(channelId)!;
  const filtered = before ? list.filter((message) => message.ts < before) : list;
  return filtered.slice(-50);
});

fastify.get('/channels/:channelId/members', async (request) => {
  const channelId = (request.params as { channelId: string }).channelId;
  return getChannelMembers(channelId);
});

fastify.get('/channels/:channelId/files', async (request) => {
  const channelId = (request.params as { channelId: string }).channelId;
  return channelFiles.get(channelId) || [];
});

fastify.post('/upload', async (request, reply) => {
  const data = await request.file();
  if (!data) return reply.code(400).send({ error: 'Nenhum ficheiro enviado' });
  const extension = path.extname(data.filename || '');
  const safeName = `${Date.now()}-${data.filename?.replace(/[^a-zA-Z0-9.\-_/]/g, '_') || 'upload'}${extension}`;
  const filePath = path.join(UPLOAD_DIR, safeName);
  await pipeline(data.file, fs.createWriteStream(filePath));
  const stats = await fs.promises.stat(filePath);
  const fileUrl = `/uploads/${safeName}`;
  return {
    url: fileUrl,
    name: data.filename,
    size: stats.size,
  };
});

const httpServer = createServer();
const wss = new WebSocketServer({ server: httpServer });

let hasStarted = false;

async function startServer() {
  if (hasStarted) return;
  hasStarted = true;

  try {
    // SKIP_PRISMA is a development/test flag only. It skips the database
    // connect step but does not change authentication logic or WebSocket
    // token parsing. Do not set this in production.
    if (!process.env.SKIP_PRISMA) {
      await prisma.$connect();
      console.log('Prisma connected');
    } else {
      console.log('SKIP_PRISMA set — skipping prisma.$connect()');
    }

    await fastify.listen({ host: '0.0.0.0', port: HTTP_PORT });
    console.log(`HTTP server listening on ${HTTP_PORT}`);

    await new Promise<void>((resolve, reject) => {
      httpServer.once('error', reject);
      httpServer.listen(WS_PORT, '0.0.0.0', () => {
        httpServer.off('error', reject);
        console.log(`WebSocket server listening on ${WS_PORT}`);
        resolve();
      });
    });
  } catch (err) {
    console.error('Failed to start ChatOps backend:', err);
    process.exit(1);
  }
}

startServer();

wss.on('connection', (ws: WebSocket, req) => {
  const rawAuth = req.headers.authorization;
  const authHeader = Array.isArray(rawAuth) ? String(rawAuth[0]) : (rawAuth as string | undefined);

  const userId = authHeader ? parseUserIdFromToken(authHeader) : null;

  // Security decision: require a valid token. Close the socket when the
  // provided token is missing or invalid to avoid silently allowing
  // unauthenticated access under the 'anon' identity.
  if (!userId) {
    try {
      ws.close(4001, 'invalid token');
    } catch (err) {
      // ignore
    }
    return;
  }

  connectionMeta.set(ws, { userId });

  ws.on('message', async (raw: WebSocket.RawData) => {
    const msgStr = raw.toString();
    try {
      const data = JSON.parse(msgStr);
      if (data.type === 'subscribe' && data.channelId) {
        const effectiveUserId = data.userId || connectionMeta.get(ws)?.userId || 'anon';
        registerConnection(ws, data.channelId, effectiveUserId);
        return;
      }

      if (data.type === 'ping') {
        ws.send(JSON.stringify({ type: 'pong', ts: Date.now() }));
        return;
      }

      if (data.type === 'typing' && data.channelId) {
        publishToChannel(data.channelId, {
          type: 'typing',
          channelId: data.channelId,
          userId: data.userId || 'anon',
        });
        return;
      }

      if (data.type === 'reaction' && data.channelId) {
        publishToChannel(data.channelId, {
          type: 'reaction',
          channelId: data.channelId,
          messageId: data.messageId,
          emoji: data.emoji,
          userId: data.userId || 'anon',
        });
        return;
      }

      if (data.type === 'message' && data.channelId && data.text) {
        const userId = data.userId || connectionMeta.get(ws)?.userId || 'anon';
        const message: ChatMessage = {
          id: data.tempId || `msg-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          tempId: data.tempId,
          channelId: data.channelId,
          userId,
          text: data.text,
          ts: Date.now(),
          system: false,
          replyToId: data.replyToId,
        };

        await addMessageToHistory(data.channelId, message);
        publishToChannel(data.channelId, { ...message, type: 'message' });

        await prisma.auditLog.create({
          data: {
            userId,
            channelId: data.channelId,
            command: message.text.split(' ')[0] || 'message',
            details: message.text,
          },
        });

        const cmdReply = await ChatOpsEngine.handleCommand(data.text, userId);
        if (cmdReply) {
          const systemMessage: ChatMessage = {
            id: `system-${Date.now()}-${Math.random().toString(36).slice(2)}`,
            channelId: data.channelId,
            userId: 'bot',
            text: cmdReply,
            ts: Date.now() + 1,
            system: true,
          };
          await addMessageToHistory(data.channelId, systemMessage);
          publishToChannel(data.channelId, { ...systemMessage, type: 'message' });
        }
        return;
      }
    } catch (err) {
      console.warn('WS parse error', err);
    }
  });

  ws.on('close', () => { removeConnection(ws); });
  ws.on('error', () => { removeConnection(ws); });
});

void (async () => {
  try {
    const redis = new (require('ioredis').default)(process.env.REDIS_URL || 'redis://127.0.0.1:6379', {
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
      reconnectOnError: () => false,
    });
    redis.on('error', () => undefined);
    await redis.psubscribe('channel:*');
    redis.on('pmessage', (_pattern: string, channel: string, message: string) => {
      const channelId = channel.replace('channel:', '');
      try {
        const payload = JSON.parse(message);
        broadcastToChannel(channelId, payload);
      } catch (err) {
        console.warn('Invalid pubsub payload', err);
      }
    });
  } catch {
    // Ignore Redis subscription errors in local/test environments.
  }
})();

console.log('ChatOps server initialized');
