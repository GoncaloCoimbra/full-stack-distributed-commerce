import { describe, expect, it } from '@jest/globals';
import { addMoney, fromCents, multiplyMoney, toCents } from '../../server/utils/money';

describe('money utils', () => {
  it('keeps decimal arithmetic stable for cents-based calculations', () => {
    expect(addMoney(0.1, 0.2)).toBe(0.3);
    expect(multiplyMoney(19.99, 3)).toBe(59.97);
  });

  it('converts decimal values to integer cents and back without drift', () => {
    expect(toCents(19.99)).toBe(1999);
    expect(toCents(0.1)).toBe(10);
    expect(fromCents(1999)).toBe(19.99);
  });
});
