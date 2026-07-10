/**
 * Picking Queue Service
 * Processa automaticamente picking jobs quando uma encomenda é paga
 */

import { createBullQueue, QueueJob, QueueLike } from '../core/queues';
import Picking from '../models/Picking';
import Order from '../models/Order';
import Product from '../models/Product';
import { PackingService, PackedBox } from './packingService';
import { eventStore } from './eventSourcing';
import { OrderEventType } from './eventSourcing';

export interface PickingJobData {
  orderId: string;
  orderNumber: string;
  userId: string;
  items: Array<{
    productId: string;
    quantity: number;
    sku: string;
  }>;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
}

class PickingQueueService {
  private pickingQueue: QueueLike<PickingJobData>;

  constructor() {
    this.pickingQueue = createBullQueue('picking') as QueueLike<PickingJobData>;
    this.setupProcessors();
  }

  /**
   * Configurar processadores de picking
   */
  private setupProcessors() {
    (this.pickingQueue as any).process(async (job: QueueJob<PickingJobData>) => {
      const { orderId, orderNumber, userId, items, priority = 'normal' } = job.data;

      try {
        // 1. Buscar order e produtos
        const order = await Order.findById(orderId).populate('items.product');
        if (!order) {
          throw new Error(`Order ${orderId} não encontrada`);
        }

        // 2. Buscar detalhes dos produtos com dimensões
        const productsData = await Product.find({
          _id: { $in: items.map((i) => i.productId) },
        });

        // 3. Preparar items para cubagem
        const packingItems = items.map((item) => {
          const product = productsData.find((p) => p._id.toString() === item.productId.toString());
          return {
            productId: item.productId,
            quantity: item.quantity,
            sku: item.sku || product?.sku || '',
            weight: product?.weight || 0.5,
            dimensions: product?.dimensions || { length: 10, width: 10, height: 10 },
          };
        });

        // 4. Calcular cubagem
        const packingResult = PackingService.calculatePacking(packingItems);

        // 5. Criar picking para cada caixa
        const pickings: Array<InstanceType<typeof Picking>> = [];
        for (let i = 0; i < packingResult.boxes.length; i++) {
          const box = packingResult.boxes[i];
          const pickingNumber = `PICK-${Date.now()}-${i + 1}`;

          // Mapear box items para picking items
          const pickingItems = box.items.map((boxItem) => {
            const originalItem = items.find((i) => i.productId === boxItem.productId);
            const product = productsData.find((p) => p._id.toString() === boxItem.productId);

            return {
              productId: boxItem.productId,
              sku: boxItem.sku,
              name: product?.name || 'Unknown',
              quantity: boxItem.quantity,
              quantityPicked: 0,
              location: this.generateWarehouseLocation(product), // A-1-1, A-1-2, etc.
            };
          });

          const picking = new Picking({
            pickingNumber,
            order: orderId,
            items: pickingItems,
            status: 'pending',
            priority,
            boxInfo: {
              boxType: box.boxType,
              dimensions: box.dimensions,
              volume: box.volume,
              weight: box.weight,
            },
            estimatedTime: this.estimatePickingTime(box.items.length),
            notes: `Criado automaticamente para Order ${orderNumber}`,
          });

          await picking.save();
          pickings.push(picking);

          console.log(`[PICKING] Criado ${pickingNumber} para Order ${orderNumber} - ${box.boxType}`);
        }

        // 6. Registar evento
        await eventStore.appendEvent(
          orderId,
          OrderEventType.PICKING_INITIATED,
          {
            pickingCount: pickings.length,
            pickingNumbers: pickings.map((p) => p.pickingNumber),
            totalBoxes: packingResult.boxes.length,
            estimatedWeight: packingResult.totalWeight,
          },
          { role: 'system' }
        );

        // 7. Broadcast via WebSocket (será feito no router)
        return {
          success: true,
          pickings: pickings.map((p) => ({
            id: p._id,
            pickingNumber: p.pickingNumber,
            status: p.status,
            priority: p.priority,
            boxType: p.boxInfo.boxType,
          })),
          message: `${pickings.length} picking(s) criado(s)`,
        };
      } catch (error: any) {
        console.error(`[PICKING ERROR] Order ${orderId}:`, error);

        // Registar falha
        await eventStore.appendEvent(
          orderId,
          OrderEventType.PICKING_FAILED,
          {
            reason: error.message,
            error: error.stack,
          },
          { role: 'system' }
        );

        throw error;
      }
    });

    // Limpar jobs completados após 24h
    void this.pickingQueue.clean?.(86400000, 'completed');
  }

  /**
   * Criar picking job (chamado quando order é paga)
   */
  async createPickingJob(orderData: PickingJobData, delay = 0): Promise<QueueJob<PickingJobData>> {
    return this.pickingQueue.add(orderData, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
      delay,
      removeOnComplete: false,
      removeOnFail: false,
      jobId: `pick-${orderData.orderId}`,
    });
  }

  /**
   * Gerar localização no armazém (exemplo simplificado)
   */
  private generateWarehouseLocation(product: any): string {
    if (product?.warehouseLocation) {
      return product.warehouseLocation;
    }

    // Formato: AISLE-ROW-COLUMN (exemplo: A-1-3)
    const aisle = String.fromCharCode(65 + Math.floor(Math.random() * 5)); // A-E
    const row = Math.floor(Math.random() * 10) + 1; // 1-10
    const column = Math.floor(Math.random() * 5) + 1; // 1-5

    return `${aisle}-${row}-${column}`;
  }

  /**
   * Estimar tempo de picking (em minutos)
   */
  private estimatePickingTime(itemCount: number): number {
    // Base: 2 minutos, +1.5 minuto por item
    return 2 + itemCount * 1.5;
  }

  /**
   * Obter fila de picking
   */
  getQueue() {
    return this.pickingQueue;
  }

  /**
   * Obter contagem de pickings por status
   */
  async getPickingStats() {
    const pending = await Picking.countByStatus('pending');
    const inProgress = await Picking.countByStatus('in_progress');
    const completed = await Picking.countByStatus('completed');

    return {
      pending,
      inProgress,
      completed,
      total: pending + inProgress + completed,
    };
  }
}

// Singleton instance
export const pickingQueueService = new PickingQueueService();
