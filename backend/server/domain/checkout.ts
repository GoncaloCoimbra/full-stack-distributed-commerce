import { addMoney, percentageOf, roundMoney } from '../utils/money';

export interface CheckoutAddressInput {
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  street?: string;
  city?: string;
  postalCode?: string;
  country?: string;
}

export interface NormalizedCheckoutAddress {
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface CheckoutLineItemInput {
  unitPrice: number;
  quantity: number;
}

export interface CheckoutTotals {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

export function normalizeCheckoutInput(address: CheckoutAddressInput = {}): NormalizedCheckoutAddress {
  const name = address.name || [address.firstName, address.lastName].filter(Boolean).join(' ').trim() || 'Cliente';

  return {
    name,
    email: address.email || '',
    phone: address.phone || '',
    street: address.street || '',
    city: address.city || '',
    postalCode: address.postalCode || '',
    country: address.country || 'Portugal',
  };
}

export function shippingForSubtotal(subtotal: number): number {
  if (subtotal >= 50) {
    return 0;
  }

  if (subtotal >= 25) {
    return 3.99;
  }

  return 5.99;
}

export function calculateCheckoutTotals(items: CheckoutLineItemInput[], discount: number = 0, loyaltyDiscount: number = 0): CheckoutTotals {
  const subtotal = roundMoney(items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0));
  const tax = percentageOf(subtotal, 23);
  const shipping = shippingForSubtotal(subtotal);
  const discountTotal = roundMoney(discount + loyaltyDiscount);
  const total = roundMoney(Math.max(addMoney(subtotal, tax, shipping) - discountTotal, 0));

  return {
    subtotal,
    tax,
    shipping,
    total,
  };
}
