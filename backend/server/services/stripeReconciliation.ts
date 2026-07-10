import Stripe from 'stripe';
import Order from '../models/Order';
import { env } from '../config/env';

export async function reconcileStripePayments(limit = 100) {
  if (!env.STRIPE_SECRET_KEY) {
    throw new Error('Stripe secret key is not configured');
  }

  const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
  });

  const orders = await Order.find({
    paymentIntentId: { $exists: true, $ne: null }
  }).lean();

  const mismatches: Array<any> = [];
  let checked = 0;

  for (const order of orders.slice(0, limit)) {
    if (!order.paymentIntentId) {
      continue;
    }

    checked += 1;
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(order.paymentIntentId as string);
      const stripeStatus = paymentIntent.status;
      const localStatus = order.paymentStatus;

      if (stripeStatus === 'succeeded' && localStatus !== 'paid') {
        mismatches.push({ orderId: order._id, orderNumber: order.orderNumber, localStatus, stripeStatus, action: 'capture' });
      } else if (stripeStatus === 'requires_payment_method' && localStatus === 'paid') {
        mismatches.push({ orderId: order._id, orderNumber: order.orderNumber, localStatus, stripeStatus, action: 'review' });
      }
    } catch (error) {
      mismatches.push({ orderId: order._id, orderNumber: order.orderNumber, error: String(error) });
    }
  }

  return {
    checked,
    mismatches,
  };
}
