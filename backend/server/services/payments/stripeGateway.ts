import { env } from '../../config/env';
import { createProtectedPaymentIntent } from '../../utils/stripeBreaker';

export class StripeGateway {
  async createPaymentIntent(total: number, metadata: Record<string, string>) {
    if (!env.STRIPE_SECRET_KEY) {
      throw new Error('Stripe não configurado');
    }

    return createProtectedPaymentIntent(total, metadata);
  }
}
