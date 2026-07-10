import { describe, expect, it } from '@jest/globals';
import { resolvePricingContext, applyPricing } from '../../server/utils/pricingEngine';

describe('pricingEngine', () => {
  it('applies enterprise tier discounts before volume discounts', () => {
    const result = resolvePricingContext({
      role: 'b2b',
      pricingTier: 'enterprise',
      b2bDiscountRate: 5,
      pricingOverrides: [{
        type: 'percentage',
        discount: 12,
        segment: 'enterprise'
      }]
    } as any, 100, 10);

    expect(result.discountRate).toBe(12);
    expect(result.pricingTier).toBe('enterprise');
  });

  it('applies custom overrides to a product price', () => {
    const price = applyPricing(50, 0, [{
      type: 'fixed',
      amount: 5,
      productId: 'product-1'
    }], 'product-1');

    expect(price).toBe(45);
  });
});
