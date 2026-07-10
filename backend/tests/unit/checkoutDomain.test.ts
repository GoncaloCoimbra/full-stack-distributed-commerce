import { describe, expect, it } from '@jest/globals';
import { calculateCheckoutTotals, normalizeCheckoutInput } from '../../server/domain/checkout';

describe('checkout domain', () => {
  it('normalizes checkout input and preserves required fields', () => {
    const result = normalizeCheckoutInput({
      firstName: 'Ana',
      lastName: 'Silva',
      email: 'ana@example.com',
      phone: '+351912345678',
      street: 'Rua Central 10',
      city: 'Lisboa',
      postalCode: '1000-001',
      country: 'Portugal',
    });

    expect(result).toEqual({
      name: 'Ana Silva',
      email: 'ana@example.com',
      phone: '+351912345678',
      street: 'Rua Central 10',
      city: 'Lisboa',
      postalCode: '1000-001',
      country: 'Portugal',
    });
  });

  it('calculates totals with reduced shipping below the free-shipping threshold and preserves money precision', () => {
    const totals = calculateCheckoutTotals([
      { unitPrice: 12.5, quantity: 2 },
      { unitPrice: 4.99, quantity: 1 },
    ], 0, 0);

    expect(totals.subtotal).toBe(29.99);
    expect(totals.tax).toBe(6.9);
    expect(totals.shipping).toBe(3.99);
    expect(totals.total).toBe(40.88);
  });
});
