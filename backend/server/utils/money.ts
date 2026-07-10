export const CURRENCY_SCALE = 100;

export function roundToCents(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.round(value * CURRENCY_SCALE);
}

export function toCents(value: number): number {
  return roundToCents(value ?? 0);
}

export function fromCents(cents: number): number {
  return Number((Number(cents ?? 0) / CURRENCY_SCALE).toFixed(2));
}

export function roundMoney(value: number): number {
  return fromCents(toCents(value));
}

export function addMoney(...values: number[]): number {
  const totalCents = values.reduce((sum, value) => sum + toCents(value), 0);
  return fromCents(totalCents);
}

export function subtractMoney(left: number, right: number): number {
  return fromCents(toCents(left) - toCents(right));
}

export function multiplyMoney(value: number, multiplier: number): number {
  return fromCents(Math.round(toCents(value) * multiplier));
}

export function applyDiscount(value: number, discountPercent: number): number {
  const discountedCents = Math.round(toCents(value) * (100 - discountPercent) / 100);
  return fromCents(discountedCents);
}

export function sumMoney(values: number[]): number {
  return addMoney(...values);
}

export function percentageOf(value: number, percentage: number): number {
  return fromCents(Math.round(toCents(value) * percentage / 100));
}
