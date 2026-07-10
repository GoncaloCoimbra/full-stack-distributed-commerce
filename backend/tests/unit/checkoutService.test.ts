import { describe, expect, it } from '@jest/globals';
import {
  calculateShipping,
  getInitialPaymentStatus,
  normalizeCheckoutAddress,
} from '../../server/services/checkoutService';

describe('checkoutService', () => {
  it('calculates free shipping for orders above 50 euros', () => {
    expect(calculateShipping(50)).toBe(0);
    expect(calculateShipping(60)).toBe(0);
  });

  it('calculates reduced shipping for orders between 25 and 50 euros', () => {
    expect(calculateShipping(25)).toBe(3.99);
    expect(calculateShipping(49.99)).toBe(3.99);
  });

  it('calculates standard shipping for orders below 25 euros', () => {
    expect(calculateShipping(24.99)).toBe(5.99);
  });

  it('normalizes checkout addresses with customer details', () => {
    expect(normalizeCheckoutAddress({
      firstName: 'Ana',
      lastName: 'Silva',
      email: 'ana@example.com',
      phone: '+351912345678',
      street: 'Rua Central, 10',
      city: 'Lisboa',
      postalCode: '1000-001',
      country: 'Portugal',
    })).toEqual({
      name: 'Ana Silva',
      email: 'ana@example.com',
      phone: '+351912345678',
      street: 'Rua Central, 10',
      city: 'Lisboa',
      postalCode: '1000-001',
      country: 'Portugal',
    });
  });

  it('keeps card payments as pending until confirmation', () => {
    expect(getInitialPaymentStatus('card')).toBe('pending');
    expect(getInitialPaymentStatus('mbway')).toBe('paid');
  });
});
