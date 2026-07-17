let fastify: any;
let stopServer: (() => Promise<void>) | undefined;

describe('ChatOps /health', () => {
  beforeAll(async () => {
    process.env.SKIP_PRISMA = 'true';
    process.env.NODE_ENV = 'test';

    const serverModule = await import('../src/server');
    fastify = serverModule.fastify;
    stopServer = serverModule.stopServer;

    await fastify.ready();
  });

  afterAll(async () => {
    if (stopServer) {
      await stopServer();
    }
  });

  it('should return health metadata including redis status', async () => {
    const res = await fastify.inject({ method: 'GET', url: '/health' });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.payload);
    expect(body).toHaveProperty('ok', true);
    expect(body).toHaveProperty('redis');
    expect(body.redis).toHaveProperty('configured');
    expect(body.redis).toHaveProperty('connected');
    expect(body.redis).toHaveProperty('source');
    expect(body).toHaveProperty('websocket');
    expect(body.websocket).toBe('enabled');
  });
});
