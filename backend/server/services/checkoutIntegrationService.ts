/**
 * CHECKOUT INTEGRATION HELPER
 * ===========================
 * Integra o sistema de fila e locks no processo de checkout
 * 
 * FLUXO:
 * 1. Validação inicial (items, user, rules)
 * 2. Criar ordem em estado "pending"
 * 3. Enfileirar para processamento
 * 4. Retornar resposta ao cliente
 * 5. Fila processa com garantias de linearizabilidade
 */

import { CheckoutQueueData, enqueueCheckout } from './checkoutQueueService';
import Order from '../models/Order';

export interface CheckoutIntegrationResult {
  orderId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  message: string;
  queueJobId?: string;
}

/**
 * Processa um checkout através da fila com garantias ACID
 * @param orderId - ID da ordem já criada
 * @param userId - ID do utilizador
 * @param items - Items da ordem com quantities
 * @returns Promise<CheckoutIntegrationResult>
 */
export async function processCheckoutWithFila(
  orderId: string,
  userId: string,
  items: Array<{ productId: string; quantity: number }>
): Promise<CheckoutIntegrationResult> {
  try {
    console.log(`[CHECKOUT INTEGRATION] Enfileirando checkout para ordem ${orderId}...`);

    // Enfileirar checkout
    const queueData: CheckoutQueueData = {
      orderId,
      userId,
      items,
      timestamp: Date.now(),
    };

    const job = await enqueueCheckout(queueData);

    // Não aguardar aqui - responder ao cliente imediatamente
    // A fila processará em background
    console.log(`[CHECKOUT INTEGRATION] ✅ Ordem ${orderId} enfileirada com job ${job.id}`);

    return {
      orderId,
      status: 'processing',
      message: 'Sua encomenda está sendo processada. Você receberá confirmação por email.',
      queueJobId: job.id.toString(),
    };
  } catch (error: any) {
    console.error(`[CHECKOUT INTEGRATION] ❌ Erro ao enfileirar:`, error);

    // Atualizar ordem para failed
    await Order.findByIdAndUpdate(orderId, {
      status: 'failed',
      paymentStatus: 'failed',
      failureReason: `Erro ao enfileirar: ${error.message}`,
    });

    return {
      orderId,
      status: 'failed',
      message: `Erro ao processar encomenda: ${error.message}`,
    };
  }
}

/**
 * Obtém o status de um checkout
 */
export async function getCheckoutStatus(orderId: string): Promise<CheckoutIntegrationResult> {
  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return {
        orderId,
        status: 'failed',
        message: 'Ordem não encontrada',
      };
    }

    return {
      orderId,
      status: (order.status as any) || 'pending',
      message: `Status atual: ${order.status}. Pagamento: ${order.paymentStatus}`,
    };
  } catch (error: any) {
    return {
      orderId,
      status: 'failed',
      message: `Erro ao obter status: ${error.message}`,
    };
  }
}

/**
 * Aguarda confirmação de um checkout (para testes/debugging)
 * NÃO usar em produção - bloqueia o request
 */
export async function waitForCheckoutCompletion(
  orderId: string,
  timeoutMs: number = 30000
): Promise<CheckoutIntegrationResult> {
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return { orderId, status: 'failed', message: 'Ordem não encontrada' };
    }

    // Poll até completion (MAX 30s)
    const startTime = Date.now();
    while (Date.now() - startTime < timeoutMs) {
      const updated = await Order.findById(orderId);

      if (updated?.status === 'confirmed') {
        return {
          orderId,
          status: 'completed',
          message: 'Encomenda confirmada com sucesso!',
        };
      }

      if (updated?.paymentStatus === 'failed') {
        return {
          orderId,
          status: 'failed',
          message: (updated as any).failureReason || 'Falha no processamento',
        };
      }

      // Esperar 500ms antes de verificar novamente
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    return {
      orderId,
      status: 'processing',
      message: 'Checkout ainda em processamento (timeout)',
    };
  } catch (error: any) {
    return {
      orderId,
      status: 'failed',
      message: `Erro: ${error.message}`,
    };
  }
}

export default {
  processCheckoutWithFila,
  getCheckoutStatus,
  waitForCheckoutCompletion,
};
