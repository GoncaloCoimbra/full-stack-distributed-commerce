import { env } from '../../config/env';
import { StripeGateway } from './stripeGateway';

export async function createManagedPaymentIntent(total: number, metadata: Record<string, string>) {
  const provider = env.PAYMENT_PROVIDER || 'stripe';

  if (provider === 'stripe') {
    return new StripeGateway().createPaymentIntent(total, metadata);
  }

  throw new Error(`Unsupported payment provider: ${provider}`);
}
