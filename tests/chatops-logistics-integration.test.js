const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('http');

process.env.LOGISTICS_URL = 'http://127.0.0.1:3100';
process.env.REDIS_URL = 'redis://127.0.0.1:6379';
process.env.DISABLE_REDIS = 'true';

const { ChatOpsEngine } = require('../Chatops/backend/dist/chatOpsEngine.js');

function startMockLogisticsServer(handler) {
  const server = http.createServer((req, res) => handler(req, res));
  return new Promise((resolve, reject) => {
    server.listen(3100, '127.0.0.1', () => resolve(server));
    server.on('error', reject);
  });
}

test('returns stock from logistics when the endpoint is reachable', async () => {
  const server = await startMockLogisticsServer((req, res) => {
    assert.equal(req.url, '/api/products/stock?sku=ABC123');
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify({
      sku: 'ABC123',
      description: 'Widget Pro',
      stock: 42,
      status: 'IN_STOCK',
    }));
  });

  try {
    const response = await ChatOpsEngine.handleCommand('/stock ABC123', 'tester');
    assert.match(response, /Stock real via Logistics/i);
    assert.match(response, /Widget Pro/i);
    assert.match(response, /42/);
  } finally {
    await new Promise((resolve, reject) => server.close((err) => (err ? reject(err) : resolve())));
  }
});

test('returns a clear error when logistics is unavailable', async () => {
  const response = await ChatOpsEngine.handleCommand('/stock MISSING', 'tester');
  assert.match(response, /não encontrado ou logística indisponível/i);
});

test('approves credit successfully when the company exists', async () => {
  const prismaClient = require('../Chatops/backend/dist/prismaClient.js');
  const originalB2BClient = prismaClient.prisma?.b2BClient;
  prismaClient.prisma.b2BClient = {
    update: async ({ where }) => ({ id: where.id, creditStatus: 'APPROVED' }),
  };

  try {
    const response = await ChatOpsEngine.handleCommand('/approve-credit company-1', 'tester');
    assert.equal(response, '✅ Crédito aprovado para empresa company-1.');
  } finally {
    if (originalB2BClient) {
      prismaClient.prisma.b2BClient = originalB2BClient;
    } else {
      delete prismaClient.prisma.b2BClient;
    }
  }
});

test('returns a clear error when approve-credit fails', async () => {
  const prismaClient = require('../Chatops/backend/dist/prismaClient.js');
  const originalB2BClient = prismaClient.prisma?.b2BClient;
  prismaClient.prisma.b2BClient = {
    update: async () => {
      throw new Error('company not found');
    },
  };

  try {
    const response = await ChatOpsEngine.handleCommand('/approve-credit missing-company', 'tester');
    assert.match(response, /Não foi possível aprovar crédito para empresa missing-company:/i);
  } finally {
    if (originalB2BClient) {
      prismaClient.prisma.b2BClient = originalB2BClient;
    } else {
      delete prismaClient.prisma.b2BClient;
    }
  }
});
