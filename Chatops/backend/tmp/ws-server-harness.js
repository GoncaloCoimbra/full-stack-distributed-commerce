const http = require('http');
const WebSocket = require('ws');
const crypto = require('crypto');

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

function parseUserIdFromToken(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.slice(7).trim();
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [header, payload, signature] = parts;
  const expected = crypto.createHmac('sha256', process.env.JWT_SECRET).update(`${header}.${payload}`).digest('base64url');
  if (signature !== expected) return null;
  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (typeof decoded.exp === 'number' && decoded.exp * 1000 <= Date.now()) return null;
    return decoded.sub || decoded.userId || decoded.id || null;
  } catch (e) {
    return null;
  }
}

const WS_PORT = Number(process.env.WS_PORT || 9001);

const server = http.createServer();
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws, req) => {
  const rawAuth = req.headers.authorization;
  const authHeader = Array.isArray(rawAuth) ? String(rawAuth[0]) : rawAuth;
  const userId = authHeader ? parseUserIdFromToken(authHeader) : null;

  if (!userId) {
    try {
      ws.close(4001, 'invalid token');
      console.log('closed connection with 4001 invalid token');
    } catch (err) {
      // ignore
    }
    return;
  }

  console.log('accepted connection for user', userId);
  ws.on('message', () => {});
});

server.listen(WS_PORT, '0.0.0.0', () => {
  console.log(`harness WebSocket server listening on ${WS_PORT}`);
});

// Graceful shutdown on SIGINT
process.on('SIGINT', () => {
  server.close(() => process.exit(0));
});

// Keep process alive
setInterval(() => {}, 1000);
