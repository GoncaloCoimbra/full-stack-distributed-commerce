import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { apiClient } from './apiClient';

describe('apiClient preview fallback', () => {
  const originalWindow = globalThis.window;

  beforeEach(() => {
    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      value: {
        location: {
          pathname: '/backup/account/orders',
        },
      },
    });
  });

  afterEach(() => {
    if (originalWindow) {
      Object.defineProperty(globalThis, 'window', {
        configurable: true,
        value: originalWindow,
      });
    } else {
      delete (globalThis as Record<string, unknown>).window;
    }
  });

  it('returns mock orders for backup routes when the backend is unavailable', async () => {
    const response = await apiClient.get<{ orders: Array<{ _id?: string; id?: string }> }>('/account/orders');

    expect(response.success).toBe(true);
    expect(response.data?.orders).toHaveLength(2);
    expect(response.data?.orders[0]._id || response.data?.orders[0].id).toBeTruthy();
  });

  it('returns a mock order payload for backup checkout submissions', async () => {
    const response = await apiClient.post<{ order: { id: string } }>('/account/orders', {
      items: [{ productId: 'demo', quantity: 1, price: 25 }],
    });

    expect(response.success).toBe(true);
    expect(response.data?.order.id).toBeTruthy();
  });
});
