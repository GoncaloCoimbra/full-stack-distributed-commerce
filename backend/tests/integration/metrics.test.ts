import request from 'supertest';
import { app } from '../../server/config/app';

describe('Metrics endpoint', () => {
  it('exposes request metrics and aggregates completed requests', async () => {
    const healthResponse = await request(app).get('/health');

    expect(healthResponse.status).toBe(200);

    const firstMetricsResponse = await request(app).get('/api/v1/metrics');
    const secondMetricsResponse = await request(app).get('/api/v1/metrics');

    expect(firstMetricsResponse.status).toBe(200);
    expect(secondMetricsResponse.status).toBe(200);
    expect(secondMetricsResponse.body.success).toBe(true);
    expect(secondMetricsResponse.body.metrics).toBeDefined();
    expect(secondMetricsResponse.body.metrics.totalRequests).toBeGreaterThanOrEqual(2);
    expect(secondMetricsResponse.body.metrics.uptimeSeconds).toBeGreaterThanOrEqual(0);
    expect(secondMetricsResponse.body.metrics.memoryUsage).toBeDefined();
    expect(secondMetricsResponse.body.metrics.requestsByRoute['GET /health'].count).toBeGreaterThanOrEqual(1);
    expect(secondMetricsResponse.body.metrics.requestsByRoute['GET /api/v1/metrics'].count).toBeGreaterThanOrEqual(1);
  });
});
