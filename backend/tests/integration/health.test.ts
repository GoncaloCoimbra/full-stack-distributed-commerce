import request from 'supertest';
import { app } from '../../server/config/app';

describe('Health endpoint', () => {
  it('responds with status OK and Redis health metadata', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'OK');
    expect(res.body).toHaveProperty('redis');
    expect(res.body.redis).toHaveProperty('configured');
    expect(res.body.redis).toHaveProperty('connected');
    expect(res.body.redis).toHaveProperty('source');
  });
});
