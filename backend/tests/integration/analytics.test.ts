import express from 'express';
import request from 'supertest';
import analyticsRoutes from '../../server/routes/analytics';

const createMock = jest.fn();

jest.mock('../../server/models/AnalyticsEvent', () => ({
  __esModule: true,
  default: {
    create: (...args: unknown[]) => createMock(...args),
  },
}));

const app = express();
app.use(express.json());
app.use('/api/v1/analytics', analyticsRoutes);

describe('Analytics events endpoint', () => {
  beforeEach(() => {
    createMock.mockReset();
    createMock.mockResolvedValue({});
  });

  it('accepts a batch of events and persists them', async () => {
    const payload = {
      events: [
        {
          name: 'page_view',
          ts: 1716400000000,
          path: '/shop',
          metadata: { source: 'home' },
        },
        {
          name: 'cart_add',
          ts: 1716400001000,
          path: '/cart',
          metadata: { productId: 'sku-1', quantity: 1 },
        },
      ],
      sessionId: 'session-123',
    };

    const res = await request(app).post('/api/v1/analytics/events').send(payload);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      stored: 2,
    });
    expect(createMock).toHaveBeenCalledTimes(2);
    expect(createMock).toHaveBeenNthCalledWith(1, expect.objectContaining({
      event: 'page_view',
      meta: expect.objectContaining({
        source: 'home',
        path: '/shop',
        ts: 1716400000000,
      }),
      anonymousId: 'session-123',
    }));
  });
});
