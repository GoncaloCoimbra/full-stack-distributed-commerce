import Stripe from 'stripe';
import { env } from '../config/env';
import { roundMoney, toCents } from '../utils/money';

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

export function calculateShipping(subtotal: number): number {
  if (subtotal >= 50) {
    return 0;
  }

  if (subtotal >= 25) {
    return 3.99;
  }

  return 5.99;
}

export { roundMoney };

export function normalizeCheckoutAddress(address: CheckoutAddressInput = {}): NormalizedCheckoutAddress {
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

export function getInitialPaymentStatus(paymentMethod: string): 'pending' | 'paid' {
  if (paymentMethod === 'card') {
    return 'pending';
  }

  return 'paid';
}

export function isStripeConfigured(): boolean {
  return Boolean(env.STRIPE_SECRET_KEY && env.STRIPE_WEBHOOK_SECRET);
}

export async function createStripePaymentIntent(total: number, metadata: Record<string, string>) {
  if (!env.STRIPE_SECRET_KEY) {
    throw new Error('Stripe não configurado');
  }

  const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
  });

  return stripe.paymentIntents.create({
    amount: toCents(total),
    currency: 'eur',
    automatic_payment_methods: {
      enabled: true,
    },
    metadata,
  });
}
