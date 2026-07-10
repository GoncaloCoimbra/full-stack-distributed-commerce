import CircuitBreaker from 'opossum';
import { createStripePaymentIntent } from '../services/checkoutService';

interface StripeIntentRequest {
  total: number;
  metadata: Record<string, string>;
}

const breaker = new CircuitBreaker<[StripeIntentRequest], Awaited<ReturnType<typeof createStripePaymentIntent>>>(
  async (request: StripeIntentRequest) => createStripePaymentIntent(request.total, request.metadata),
  {
    timeout: 8000,
    errorThresholdPercentage: 50,
    volumeThreshold: 5,
    resetTimeout: 30_000,
  }
);

export async function createProtectedPaymentIntent(total: number, metadata: Record<string, string>) {
  try {
    return await breaker.fire({ total, metadata });
  } catch (error: any) {
    if (error?.name === 'CircuitBreakerError') {
      throw new Error('Stripe está temporariamente indisponível. Tente novamente em alguns minutos.');
    }

    throw error;
  }
}
