import { describe, expect, it } from 'vitest';
import { getPaymentMethodOptions, getPaymentStatusConfig, getShippingEstimate, normalizePaymentStatus } from './checkoutUtils';

describe('checkout utilities', () => {
  it('returns zero shipping for orders above the free shipping threshold', () => {
    expect(getShippingEstimate(60)).toBe(0);
  });

  it('returns the reduced shipping value for mid-range orders', () => {
    expect(getShippingEstimate(30)).toBe(3.99);
  });

  it('keeps the card option disabled when Stripe is not configured and other methods available', () => {
    const methods = getPaymentMethodOptions(false);

    expect(methods).toHaveLength(4);
    expect(methods[0]).toMatchObject({
      id: 'card',
      available: false,
    });
    expect(methods.slice(1)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'paypal', available: true }),
        expect.objectContaining({ id: 'mbway', available: true }),
        expect.objectContaining({ id: 'multibanco', available: true }),
      ]),
    );
  });

  it('keeps all payment methods available when Stripe is configured', () => {
    const methods = getPaymentMethodOptions(true);

    expect(methods).toHaveLength(4);
    expect(methods).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'card', available: true }),
        expect.objectContaining({ id: 'paypal', available: true }),
        expect.objectContaining({ id: 'mbway', available: true }),
        expect.objectContaining({ id: 'multibanco', available: true }),
      ]),
    );
  });

  it('normalizes payment state values from backend and Stripe responses', () => {
    expect(normalizePaymentStatus('paid')).toBe('paid');
    expect(normalizePaymentStatus('pending')).toBe('pending');
    expect(normalizePaymentStatus('requires_action')).toBe('requires_action');
    expect(normalizePaymentStatus('failed')).toBe('failed');
    expect(normalizePaymentStatus(undefined)).toBe('pending');
  });

  it('exposes explicit labels and messages for each payment status', () => {
    expect(getPaymentStatusConfig('paid')).toMatchObject({
      label: 'Confirmado',
      tone: 'success',
    });

    expect(getPaymentStatusConfig('pending')).toMatchObject({
      label: 'Pendente',
      tone: 'warning',
    });

    expect(getPaymentStatusConfig('requires_action')).toMatchObject({
      label: 'Ação necessária',
      tone: 'info',
    });

    expect(getPaymentStatusConfig('failed')).toMatchObject({
      label: 'Falhou',
      tone: 'danger',
    });
  });
});
