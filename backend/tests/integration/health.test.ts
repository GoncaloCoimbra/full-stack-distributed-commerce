import request from 'supertest';
import { app } from '../../server/config/app';

describe('Health endpoint', () => {
  it('responds with readiness metadata for database and Redis', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('ok', true);
    expect(res.body).toHaveProperty('status', 'ready');
    expect(res.body).toHaveProperty('database');
    expect(res.body.database).toHaveProperty('configured');
    expect(res.body.database).toHaveProperty('connected');
    expect(res.body.database).toHaveProperty('source');
    expect(res.body).toHaveProperty('redis');
    expect(res.body.redis).toHaveProperty('configured');
    expect(res.body.redis).toHaveProperty('connected');
    expect(res.body.redis).toHaveProperty('source');
  });

  it('exposes readiness and liveness probes for operational checks', async () => {
    const readyRes = await request(app).get('/readyz');
    expect(readyRes.status).toBe(200);
    expect(readyRes.body).toHaveProperty('ok', true);
    expect(readyRes.body).toHaveProperty('status', 'ready');

    const liveRes = await request(app).get('/livez');
    expect(liveRes.status).toBe(200);
    expect(liveRes.body).toHaveProperty('ok', true);
    expect(liveRes.body).toHaveProperty('status', 'alive');
  });
});
