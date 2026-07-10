import { Router, Request, Response } from 'express';
import Stripe from 'stripe';
import Order from '../models/Order';
import Product from '../models/Product';
import User from '../models/User';
import { asyncHandler } from '../utils/handlers';
import { authenticate, isB2BRole, userRateLimit } from '../middleware/auth';
import { env } from '../config/env';
import { calculateCheckoutTotals, normalizeCheckoutInput } from '../domain/checkout';
import { sendOrderConfirmation } from '../services/emailService';
import {
  getInitialPaymentStatus,
  isStripeConfigured,
  roundMoney,
} from '../services/checkoutService';
import { getEffectivePrice, resolvePricingContext } from '../utils/pricingEngine';
import { clearIdempotencyRecord, getIdempotencyRecord, setIdempotencyProcessing, setIdempotencyResult } from '../utils/idempotency';
import { evaluateCheckoutRules } from '../services/rulesEngine';
import { incrementBusinessMetric } from '../utils/metrics';
import { createManagedPaymentIntent } from '../services/payments';
import { dispatchWebhookEvent } from '../services/webhookDispatcher';
import { clearProductCache } from '../utils/cache';
import { processCheckoutWithFila } from '../services/checkoutIntegrationService';
import { pickingQueueService } from '../services/pickingQueueService';

const router = Router();

function validateRequired(value: string | undefined, fieldName: string): string {
  if (!value || !value.trim()) {
    throw new Error(`Campo obrigatório: ${fieldName}`);
  }

  return value.trim();
}

function normalizeItems(items: Array<any>) {
  return items.map((item) => ({
    productId: String(item.productId || item.id || ''),
    quantity: Number(item.quantity || 1),
    variants: item.variants || {},
  }));
}

export async function handleStripeWebhook(req: Request, res: Response) {
  if (!env.STRIPE_SECRET_KEY || !env.STRIPE_WEBHOOK_SECRET) {
    return res.status(501).json({
      success: false,
      error: 'Stripe não configurado',
    });
  }

  const signature = req.headers['stripe-signature'] as string;
  if (!signature) {
    return res.status(400).json({
      success: false,
      error: 'Assinatura do webhook ausente',
    });
  }

  const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
  });

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body as Buffer, signature, env.STRIPE_WEBHOOK_SECRET);
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      error: `Webhook inválido: ${error.message}`,
    });
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const order = await Order.findOne({ paymentIntentId: paymentIntent.id });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Encomenda não encontrada para este pagamento',
      });
    }

    order.paymentStatus = 'paid';
    order.status = 'confirmed';
    order.calculateTotals();
    await order.save();

    const user = await User.findById(order.user);
    if (user) {
      user.loyaltyPoints += order.loyaltyPointsEarned;
      await user.save();
      await sendOrderConfirmation(user.email, {
        orderNumber: order.orderNumber,
        orderId: order._id,
        items: order.items,
        total: order.total,
        status: order.status,
      });
    }

    // ✅ NOVO: Disparar picking job automaticamente
    try {
      const pickingItems = order.items.map((item) => ({
        productId: item.product?.toString?.() ?? String(item.product || ''),
        quantity: item.quantity,
        sku: item.sku,
      }));

      await pickingQueueService.createPickingJob({
        orderId: order._id.toString(),
        orderNumber: order.orderNumber,
        userId: order.user.toString(),
        items: pickingItems,
        priority: 'normal',
      });

      console.log(`[WEBHOOK] Picking job criado para Order ${order.orderNumber}`);
    } catch (pickingError) {
      console.error(`[WEBHOOK ERROR] Falha ao criar picking job:`, pickingError);
      // Não falhar o webhook, apenas registar erro
    }

    return res.json({ success: true, received: true });
  }

  if (event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    await Order.findOneAndUpdate(
      { paymentIntentId: paymentIntent.id },
      {
        paymentStatus: 'failed',
        status: 'pending',
      }
    );

    return res.json({ success: true, received: true });
  }

  return res.json({ success: true, received: true });
}

router.post('/checkout', authenticate, userRateLimit, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      error: 'Autenticação necessária',
    });
  }

  const body = req.body || {};
  const items = normalizeItems(body.items || []);
  const paymentMethod = String(body.paymentMethod || 'multibanco');
  const shippingMethod = String(body.shippingMethod || 'standard');
  const loyaltyPointsUsed = Math.max(0, Number(body.loyaltyPointsUsed || 0));
  const rawDiscount = Number(body.discount || 0);
  const idempotencyKey = String(req.headers['x-idempotency-key'] || '').trim();

  if (!Array.isArray(body.items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'A encomenda deve conter pelo menos um item',
    });
  }

  if (idempotencyKey) {
    const cachedRecord = await getIdempotencyRecord(idempotencyKey);

    if (cachedRecord) {
      if (cachedRecord.status === 'completed') {
        return res.status(cachedRecord.statusCode).json(cachedRecord.response);
      }

      return res.status(409).json({
        success: false,
        error: 'Checkout já está a ser processado. Tente novamente em alguns segundos.',
      });
    }

    await setIdempotencyProcessing(idempotencyKey);
  }

  const user = await User.findById(userId);
  if (!user) {
    if (idempotencyKey) {
      await clearIdempotencyRecord(idempotencyKey);
    }

    return res.status(404).json({
      success: false,
      error: 'Usuário não encontrado',
    });
  }

  if (loyaltyPointsUsed > user.loyaltyPoints) {
    if (idempotencyKey) {
      await clearIdempotencyRecord(idempotencyKey);
    }

    return res.status(400).json({
      success: false,
      error: 'Pontos de fidelidade inválidos',
    });
  }

  try {
    const shippingAddress = normalizeCheckoutInput(body.shippingAddress || {});
    const billingAddress = normalizeCheckoutInput(body.billingAddress || body.shippingAddress || {});

    validateRequired(shippingAddress.street, 'Rua');
    validateRequired(shippingAddress.city, 'Cidade');
    validateRequired(shippingAddress.postalCode, 'Código postal');
    validateRequired(shippingAddress.email, 'E-mail');
    validateRequired(shippingAddress.phone, 'Telefone');
    validateRequired(shippingAddress.name, 'Nome');

    const productIds = items.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds }, isActive: true });

    if (products.length !== items.length) {
      if (idempotencyKey) {
        await clearIdempotencyRecord(idempotencyKey);
      }

      return res.status(400).json({
        success: false,
        error: 'Um ou mais produtos não estão disponíveis',
      });
    }

    const pricingContext = resolvePricingContext(user as any, 1);
    const orderItems = items.map((item) => {
      const product = products.find((candidate) => candidate._id.toString() === item.productId);

      if (!product) {
        throw new Error('Produto não encontrado');
      }

      const quantity = Number(item.quantity || 1);

      if (!product.inStock || product.stockQuantity < quantity) {
        throw new Error(`O produto ${product.name} não tem stock suficiente`);
      }

      const unitPrice = getEffectivePrice(product.currentPrice || product.price, {
        role: user.role,
        pricingTier: pricingContext.pricingTier as any,
        pricingOverrides: pricingContext.overrides,
        b2bDiscountRate: pricingContext.discountRate,
      }, product._id.toString(), undefined, quantity);
      const total = roundMoney(unitPrice * quantity);

      return {
        product: product._id,
        name: product.name,
        sku: product.sku,
        price: roundMoney(unitPrice),
        quantity,
        variants: item.variants || {},
        total,
      };
    });

    const loyaltyDiscount = roundMoney(loyaltyPointsUsed / 100);
    const discount = roundMoney(rawDiscount + loyaltyDiscount);
    const totals = calculateCheckoutTotals(orderItems.map((item) => ({ unitPrice: item.price, quantity: item.quantity })), discount, 0);

    const ruleDecision = evaluateCheckoutRules({
      user,
      totals: {
        ...totals,
        discount,
      },
      paymentMethod,
      items: orderItems.map((item) => ({ quantity: item.quantity, price: item.price, name: item.name })),
    });

    if (!ruleDecision.allowed) {
      if (idempotencyKey) {
        await clearIdempotencyRecord(idempotencyKey);
      }
      incrementBusinessMetric('checkoutFailureCount');
      return res.status(402).json({
        success: false,
        error: ruleDecision.reason || 'Regras de checkout impediram o processamento desta encomenda',
      });
    }

    const creditLimit = user.creditLimit ?? 0;
    if (isB2BRole(user.role) && user.paymentTerms === 'credit' && creditLimit > 0 && totals.total > creditLimit) {
      if (idempotencyKey) {
        await clearIdempotencyRecord(idempotencyKey);
      }

      return res.status(402).json({
        success: false,
        error: 'Limite de crédito excedido para esta encomenda',
      });
    }

    const paymentStatus = getInitialPaymentStatus(paymentMethod);
    const order = new Order({
      user: user._id,
      items: orderItems,
      subtotal: totals.subtotal,
      tax: totals.tax,
      shipping: totals.shipping,
      discount,
      total: totals.total,
      currency: 'EUR',
      status: paymentStatus === 'paid' ? 'confirmed' : 'pending',
      paymentStatus,
      paymentMethod,
      shippingAddress,
      billingAddress,
      shippingMethod,
      notes: body.notes || '',
      loyaltyPointsEarned: paymentStatus === 'paid' ? Math.floor(totals.total / 10) : 0,
      loyaltyPointsUsed,
    });

    await order.save();

    let paymentIntentId: string | undefined;
    let clientSecret: string | undefined;

    if (paymentMethod === 'card' && isStripeConfigured()) {
      const paymentIntent = await createManagedPaymentIntent(totals.total, {
        orderId: order._id.toString(),
        userId: userId,
      });

      paymentIntentId = paymentIntent.id;
      clientSecret = paymentIntent.client_secret || undefined;

      order.paymentIntentId = paymentIntentId;
      await order.save();
    }

    const updatedProducts: any[] = [];
    try {
      // NOVO: Enfileirar checkout com garantias de linearizabilidade
      // Isto envia para BullMQ que vai:
      // 1. Adquirir Redis locks para cada produto
      // 2. Verificar stock atomicamente
      // 3. Decrementar stock sem race conditions
      // 4. Liberar locks
      await processCheckoutWithFila(
        order._id.toString(),
        userId,
        items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        }))
      );

      void dispatchWebhookEvent('order.created', {
        orderId: order._id.toString(),
        userId,
        status: order.status,
        total: order.total,
        paymentStatus: order.paymentStatus,
      });
    } catch (stockError) {
      await Order.findByIdAndUpdate(order._id, {
        status: 'cancelled',
        paymentStatus: 'failed',
        cancelledReason: (stockError as Error).message,
      });
      throw stockError;
    }

    if (paymentStatus === 'paid') {
      user.loyaltyPoints += order.loyaltyPointsEarned;
      await user.save();
    }

    await sendOrderConfirmation(user.email, {
      orderNumber: order.orderNumber,
      orderId: order._id,
      items: order.items,
      total: order.total,
      status: order.status,
    });

    const responsePayload = {
      success: true,
      message: 'Encomenda recebida e está sendo processada com segurança garantida de stock',
      status: 'processing',
      order: order.toObject(),
      paymentStatus,
      paymentIntentId,
      clientSecret,
    };

    if (idempotencyKey) {
      await setIdempotencyResult(idempotencyKey, {
        statusCode: 202,
        response: responsePayload,
      });
    }

    incrementBusinessMetric('checkoutSuccessCount');
    // Retornar 202 Accepted - checkout está em processamento (não 201 Created)
    return res.status(202).json(responsePayload);
  } catch (error: any) {
    if (idempotencyKey) {
      await clearIdempotencyRecord(idempotencyKey);
    }

    if (error instanceof Error && error.message.startsWith('Campo obrigatório')) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    throw error;
  }
}));

/**
 * GET /checkout/:orderId/status
 * Verifica o status de um checkout (para polling do cliente)
 */
router.get('/checkout/:orderId/status', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const userId = (req as any).user?.userId;

  if (!orderId) {
    return res.status(400).json({
      success: false,
      error: 'Order ID é requerido',
    });
  }

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Encomenda não encontrada',
      });
    }

    // Verificação de autorização (apenas o dono ou admin pode ver)
    if (order.user.toString() !== userId && (req as any).user?.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        error: 'Sem permissão para ver esta encomenda',
      });
    }

    return res.json({
      success: true,
      orderId: order._id,
      status: order.status, // pending | confirmed | failed | cancelled
      paymentStatus: order.paymentStatus, // pending | paid | failed
      total: order.total,
      message: getStatusMessage(order.status),
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Erro ao obter status',
    });
  }
}));

function getStatusMessage(status: string): string {
  const messages: Record<string, string> = {
    pending: 'Encomenda aguardando pagamento',
    confirmed: 'Encomenda confirmada com sucesso',
    processing: 'Encomenda a ser processada',
    failed: 'Falha no processamento da encomenda',
    cancelled: 'Encomenda cancelada',
  };
  return messages[status] || 'Status desconhecido';
}

export default router;
