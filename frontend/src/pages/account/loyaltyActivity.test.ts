import { describe, expect, it } from 'vitest';
import { buildLoyaltyActivity } from './loyaltyActivity';

describe('buildLoyaltyActivity', () => {
  it('creates positive and negative activity rows from recent orders', () => {
    const activity = buildLoyaltyActivity([
      {
        _id: 'ord_1',
        createdAt: '2026-05-15T10:30:00.000Z',
        loyaltyPointsEarned: 120,
        loyaltyPointsUsed: 0,
        items: [
          { product: { name: 'Caderno A4 80 folhas' } },
          { product: { name: 'Tesoura escolar' } },
        ],
      },
      {
        _id: 'ord_2',
        createdAt: '2026-05-10T09:15:00.000Z',
        loyaltyPointsEarned: 0,
        loyaltyPointsUsed: 50,
        items: [{ product: { name: 'Kit Executivo' } }],
      },
    ]);

    expect(activity).toEqual([
      {
        id: 'ord_1',
        date: '15/05/2026',
        description: 'Compra de Caderno A4 80 folhas e Tesoura escolar',
        points: '+120',
      },
      {
        id: 'ord_2',
        date: '10/05/2026',
        description: 'Resgate de pontos em Kit Executivo',
        points: '-50',
      },
    ]);
  });

  it('falls back to a generic description when no item names are available', () => {
    const activity = buildLoyaltyActivity([
      {
        _id: 'ord_3',
        createdAt: '2026-05-01T08:00:00.000Z',
        loyaltyPointsEarned: 40,
        loyaltyPointsUsed: 0,
        items: [],
      },
    ]);

    expect(activity).toEqual([
      {
        id: 'ord_3',
        date: '01/05/2026',
        description: 'Compra realizada',
        points: '+40',
      },
    ]);
  });
});
