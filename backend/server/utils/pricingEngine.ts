import { roundMoney } from './money';

export type PricingTier = 'starter' | 'growth' | 'enterprise';

export interface PricingOverride {
  type: 'percentage' | 'fixed';
  discount?: number;
  amount?: number;
  productId?: string;
  categoryId?: string;
  segment?: PricingTier;
  minQuantity?: number;
  maxQuantity?: number;
}

export interface PricingContextInput {
  role?: string;
  pricingTier?: PricingTier;
  b2bDiscountRate?: number;
  customPricingEnabled?: boolean;
  pricingOverrides?: PricingOverride[];
}

export interface PricingContext {
  pricingTier: PricingTier;
  discountRate: number;
  overrides: PricingOverride[];
}

const DEFAULT_TIER_DISCOUNTS: Record<PricingTier, number> = {
  starter: 0,
  growth: 8,
  enterprise: 15,
};

function isB2BRole(role?: string) {
  return role === 'b2b' || role === 'b2b_buyer' || role === 'b2b_manager';
}

function matchesOverride(override: PricingOverride, productId?: string, categoryId?: string, quantity?: number) {
  if (override.productId && override.productId !== productId) {
    return false;
  }

  if (override.categoryId && override.categoryId !== categoryId) {
    return false;
  }

  if (typeof override.minQuantity === 'number' && quantity !== undefined && quantity < override.minQuantity) {
    return false;
  }

  if (typeof override.maxQuantity === 'number' && quantity !== undefined && quantity > override.maxQuantity) {
    return false;
  }

  return true;
}

export function resolvePricingContext(user: PricingContextInput | null | undefined, quantity = 1): PricingContext {
  const pricingTier = user?.pricingTier || 'starter';
  const overrides = user?.pricingOverrides || [];
  const baseDiscount = isB2BRole(user?.role) ? Number(user?.b2bDiscountRate || 0) : 0;
  const tierDiscount = DEFAULT_TIER_DISCOUNTS[pricingTier] || 0;

  const applicablePercentageOverride = overrides
    .filter((override) => override.type === 'percentage' && matchesOverride(override, undefined, undefined, quantity))
    .sort((a, b) => Number(b.discount || 0) - Number(a.discount || 0))[0];

  const discountRate = applicablePercentageOverride?.discount !== undefined
    ? applicablePercentageOverride.discount
    : Math.max(baseDiscount, tierDiscount);

  return {
    pricingTier,
    discountRate,
    overrides,
  };
}

export function applyPricing(basePrice: number, discountRate: number, overrides: PricingOverride[] = [], productId?: string, categoryId?: string, quantity = 1) {
  let price = roundMoney(basePrice);

  const applicableFixedOverride = overrides
    .filter((override) => override.type === 'fixed' && matchesOverride(override, productId, categoryId, quantity))
    .sort((a, b) => Number(b.amount || 0) - Number(a.amount || 0))[0];

  if (applicableFixedOverride?.amount !== undefined) {
    price = roundMoney(price - applicableFixedOverride.amount);
  }

  if (discountRate > 0) {
    price = roundMoney(price * (100 - discountRate) / 100);
  }

  return roundMoney(Math.max(price, 0));
}

export function getEffectivePrice(basePrice: number, user: PricingContextInput | null | undefined, productId?: string, categoryId?: string, quantity = 1) {
  const context = resolvePricingContext(user, quantity);
  return applyPricing(basePrice, context.discountRate, context.overrides, productId, categoryId, quantity);
}
