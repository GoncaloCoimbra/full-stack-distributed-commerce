/**
 * Saga Pattern Orchestrator
 * Coordena transações distribuídas entre PostgreSQL, MongoDB e Stripe.
 * Se uma etapa falhar, dispara automaticamente compensações.
 */

import { prisma } from '../config/prisma';
import Order from '../models/Order';
import Product from '../models/Product';
import Stripe from 'stripe';
import { env } from '../config/env';
import { createBullQueue, QueueJob, QueueLike } from '../core/queues';

export enum SagaStep {
  VALIDATE_ORDER = 'VALIDATE_ORDER',
  RESERVE_STOCK = 'RESERVE_STOCK',
  INITIATE_PAYMENT = 'INITIATE_PAYMENT',
  APPROVE_PAYMENT = 'APPROVE_PAYMENT',
  UPDATE_INVENTORY = 'UPDATE_INVENTORY',
  CONFIRM_ORDER = 'CONFIRM_ORDER',
}

export interface SagaContext {
  sagaId: string;
  orderId: string;
  userId: string;
  items: Array<{ productId: string; quantity: number; price: number }>;
  total: number;
  paymentMethod: string;
  status: 'pending' | 'succeeded' | 'failed' | 'compensating' | 'compensated';
  completedSteps: SagaStep[];
  failedStep?: SagaStep;
  failureReason?: string;
  metadata: Record<string, any>;
}

class SagaOrchestrator {
  private checkoutQueue: QueueLike<SagaContext>;
  private stripe: Stripe;

  constructor() {
    this.checkoutQueue = createBullQueue('checkout-saga') as QueueLike<SagaContext>;
    this.stripe = new Stripe(env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2023-10-16',
    });

    this.setupProcessors();
  }

  /**
   * Iniciar uma transação distribuída (Saga)
   */
  async startCheckoutSaga(context: Omit<SagaContext, 'sagaId' | 'status' | 'completedSteps'>): Promise<SagaContext> {
    const sagaContext: SagaContext = {
      ...context,
      sagaId: `saga-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      status: 'pending',
      completedSteps: [],
    };

    await this.checkoutQueue.add(sagaContext, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
      removeOnComplete: false,
      removeOnFail: false,
    });

    return sagaContext;
  }

  /**
   * Configurar processadores para cada etapa da Saga
   */
  private setupProcessors() {
    (this.checkoutQueue as any).process(async (job: QueueJob<SagaContext>) => {
      const context = job.data as SagaContext;
      let currentStep: SagaStep | null = null;

      try {
        for (const step of [
          SagaStep.VALIDATE_ORDER,
          SagaStep.RESERVE_STOCK,
          SagaStep.INITIATE_PAYMENT,
          SagaStep.APPROVE_PAYMENT,
          SagaStep.UPDATE_INVENTORY,
          SagaStep.CONFIRM_ORDER,
        ]) {
          currentStep = step;

          if (context.completedSteps.includes(step)) {
            continue;
          }

          console.log(`[SAGA ${context.sagaId}] Iniciando etapa: ${step}`);

          switch (step) {
            case SagaStep.VALIDATE_ORDER:
              await this.validateOrder(context);
              break;
            case SagaStep.RESERVE_STOCK:
              await this.reserveStock(context);
              break;
            case SagaStep.INITIATE_PAYMENT:
              await this.initiatePayment(context);
              break;
            case SagaStep.APPROVE_PAYMENT:
              await this.approvePayment(context);
              break;
            case SagaStep.UPDATE_INVENTORY:
              await this.updateInventory(context);
              break;
            case SagaStep.CONFIRM_ORDER:
              await this.confirmOrder(context);
              break;
          }

          context.completedSteps.push(step);
          job.progress((context.completedSteps.length / 6) * 100);
        }

        context.status = 'succeeded';
        console.log(`[SAGA ${context.sagaId}] Transação concluída com sucesso`);
        return context;
      } catch (error: any) {
        console.error(`[SAGA ${context.sagaId}] Erro na etapa ${currentStep}:`, error.message);

        context.status = 'compensating';
        context.failedStep = currentStep || undefined;
        context.failureReason = error.message;

        await this.compensate(context);

        context.status = 'compensated';
        throw error;
      }
    });
  }

  private async validateOrder(context: SagaContext): Promise<void> {
    const order = await Order.findById(context.orderId);
    if (!order) {
      throw new Error(`Encomenda ${context.orderId} não encontrada`);
    }

    if (context.items.length === 0) {
      throw new Error('Encomenda sem itens');
    }
  }

  private async reserveStock(context: SagaContext): Promise<void> {
    for (const item of context.items) {
      const product = await Product.findById(item.productId);
      if (!product || product.stockQuantity < item.quantity) {
        throw new Error(`Stock insuficiente para produto ${item.productId}`);
      }
    }
  }

  private async initiatePayment(context: SagaContext): Promise<void> {
    if (context.paymentMethod === 'card') {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(context.total * 100),
        currency: 'eur',
        metadata: {
          sagaId: context.sagaId,
          orderId: context.orderId,
        },
      });

      context.metadata.paymentIntentId = paymentIntent.id;
    }
  }

  private async approvePayment(context: SagaContext): Promise<void> {
    if (context.paymentMethod === 'card' && context.metadata.paymentIntentId) {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(
        context.metadata.paymentIntentId
      );

      if (paymentIntent.status !== 'succeeded') {
        throw new Error(`Pagamento ${context.metadata.paymentIntentId} não foi aprovado`);
      }
    }
  }

  private async updateInventory(context: SagaContext): Promise<void> {
    for (const item of context.items) {
      const updated = await Product.findOneAndUpdate(
        { _id: item.productId, stockQuantity: { $gte: item.quantity } },
        { $inc: { stockQuantity: -item.quantity } },
        { new: true }
      );

      if (!updated) {
        throw new Error(`Falha ao atualizar stock do produto ${item.productId}`);
      }
    }
  }

  private async confirmOrder(context: SagaContext): Promise<void> {
    const order = await Order.findByIdAndUpdate(
      context.orderId,
      {
        status: 'confirmed',
        paymentStatus: 'paid',
        paymentIntentId: context.metadata.paymentIntentId,
      },
      { new: true }
    );

    if (!order) {
      throw new Error(`Falha ao confirmar encomenda ${context.orderId}`);
    }
  }

  /**
   * Compensação automática - desfazer o que foi feito se algo falhar
   */
  private async compensate(context: SagaContext): Promise<void> {
    console.log(`[SAGA ${context.sagaId}] Iniciando compensação...`);

    // Reverter na ordem inversa das etapas completadas
    for (const step of context.completedSteps.reverse()) {
      try {
        switch (step) {
          case SagaStep.CONFIRM_ORDER:
            await Order.findByIdAndUpdate(context.orderId, { status: 'cancelled' });
            break;

          case SagaStep.UPDATE_INVENTORY:
            for (const item of context.items) {
              await Product.findByIdAndUpdate(item.productId, {
                $inc: { stockQuantity: item.quantity },
              });
            }
            break;

          case SagaStep.APPROVE_PAYMENT:
          case SagaStep.INITIATE_PAYMENT:
            if (context.metadata.paymentIntentId) {
              await this.stripe.refunds.create({
                payment_intent: context.metadata.paymentIntentId,
              });
            }
            break;

          default:
            break;
        }

        console.log(`[SAGA ${context.sagaId}] Compensação concluída para: ${step}`);
      } catch (error: any) {
        console.error(`[SAGA ${context.sagaId}] Erro na compensação de ${step}:`, error.message);
      }
    }
  }

  /**
   * Obter status de uma Saga
   */
  async getSagaStatus(sagaId: string): Promise<SagaContext | null> {
    const jobs = (await this.checkoutQueue.getJobs?.(['completed', 'failed', 'active'])) || [];
    const matchedJob = jobs.find((job: QueueJob<SagaContext>) => job.data.sagaId === sagaId);
    return matchedJob?.data || null;
  }
}

export const sagaOrchestrator = new SagaOrchestrator();
