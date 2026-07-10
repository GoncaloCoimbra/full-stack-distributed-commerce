/**
 * Event Sourcing Service
 * Todos os eventos de encomenda são imutáveis e auditáveis.
 * Permite reconstruir o estado exato de uma encomenda em qualquer ponto do tempo.
 */

import Order from '../models/Order';
import { prisma } from '../config/prisma';

export enum OrderEventType {
  CREATED = 'ORDER_CREATED',
  VALIDATED = 'ORDER_VALIDATED',
  PAYMENT_INITIATED = 'PAYMENT_INITIATED',
  PAYMENT_APPROVED = 'PAYMENT_APPROVED',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  STOCK_RESERVED = 'STOCK_RESERVED',
  STOCK_RELEASED = 'STOCK_RELEASED',
  PICKING_INITIATED = 'PICKING_INITIATED',
  PICKING_STARTED = 'PICKING_STARTED',
  PICKING_COMPLETED = 'PICKING_COMPLETED',
  PICKING_FAILED = 'PICKING_FAILED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export interface OrderEvent {
  id: string;
  orderId: string;
  eventType: OrderEventType;
  aggregateVersion: number;
  timestamp: Date;
  actor: {
    userId?: string;
    role: 'user' | 'system' | 'admin';
  };
  data: Record<string, any>;
  metadata: {
    ip?: string;
    userAgent?: string;
    correlation_id?: string;
  };
}

class EventStore {
  /**
   * Registar um evento no Event Store
   */
  async appendEvent(
    orderId: string,
    eventType: OrderEventType,
    data: Record<string, any>,
    actor: { userId?: string; role: 'user' | 'system' | 'admin' },
    metadata?: Record<string, any>
  ): Promise<OrderEvent> {
    const event: OrderEvent = {
      id: `${orderId}-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      orderId,
      eventType,
      aggregateVersion: await this.getAggregateVersion(orderId) + 1,
      timestamp: new Date(),
      actor,
      data,
      metadata: metadata || {},
    };

    // Gravar no PostgreSQL como evento imutável
    // Usando raw SQL para garantir WORM (Write-Once Read-Many)
    await prisma.$executeRawUnsafe(
      `INSERT INTO order_events (id, order_id, event_type, aggregate_version, timestamp, actor, data, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      event.id,
      event.orderId,
      event.eventType,
      event.aggregateVersion,
      event.timestamp,
      JSON.stringify(event.actor),
      JSON.stringify(event.data),
      JSON.stringify(event.metadata)
    );

    return event;
  }

  /**
   * Obter versão agregada atual de uma encomenda
   */
  async getAggregateVersion(orderId: string): Promise<number> {
    const result = await prisma.$queryRawUnsafe(
      `SELECT COALESCE(MAX(aggregate_version), 0) as version FROM order_events WHERE order_id = $1`,
      orderId
    ) as any[];

    return result[0]?.version ?? 0;
  }

  /**
   * Reconstruir estado de uma encomenda a partir do Event Store
   */
  async rebuildState(orderId: string, upToTimestamp?: Date): Promise<any> {
    let query = `SELECT * FROM order_events WHERE order_id = $1`;
    const params: any[] = [orderId];

    if (upToTimestamp) {
      query += ` AND timestamp <= $2`;
      params.push(upToTimestamp);
    }

    query += ` ORDER BY aggregate_version ASC`;

    const events = await prisma.$queryRawUnsafe(query, ...params) as any[];

    let state: any = {
      orderId,
      status: 'PENDING',
      items: [],
      total: 0,
      events: [],
    };

    for (const event of events) {
      state = this.applyEvent(state, event);
      state.events.push(event);
    }

    return state;
  }

  /**
   * Aplicar um evento ao estado agregado
   */
  private applyEvent(state: any, event: any): any {
    switch (event.event_type) {
      case OrderEventType.CREATED:
        return {
          ...state,
          ...event.data,
          status: 'CREATED',
        };

      case OrderEventType.VALIDATED:
        return {
          ...state,
          status: 'VALIDATED',
          validatedAt: event.timestamp,
        };

      case OrderEventType.PAYMENT_INITIATED:
        return {
          ...state,
          status: 'PAYMENT_PENDING',
          paymentIntentId: event.data.paymentIntentId,
        };

      case OrderEventType.PAYMENT_APPROVED:
        return {
          ...state,
          status: 'PAYMENT_APPROVED',
          paymentStatus: 'paid',
          paidAt: event.timestamp,
        };

      case OrderEventType.STOCK_RESERVED:
        return {
          ...state,
          status: 'STOCK_RESERVED',
          reservedAt: event.timestamp,
        };

      case OrderEventType.REFUNDED:
        return {
          ...state,
          status: 'REFUNDED',
          refundedAt: event.timestamp,
          refundReason: event.data.reason,
        };

      case OrderEventType.CANCELLED:
        return {
          ...state,
          status: 'CANCELLED',
          cancelledAt: event.timestamp,
          cancelledReason: event.data.reason,
        };

      case OrderEventType.PICKING_INITIATED:
        return {
          ...state,
          status: 'PICKING_INITIATED',
          pickingInitiatedAt: event.timestamp,
          pickingNumbers: event.data.pickingNumbers,
        };

      case OrderEventType.PICKING_STARTED:
        return {
          ...state,
          status: 'PICKING_IN_PROGRESS',
          pickingStartedAt: event.timestamp,
        };

      case OrderEventType.PICKING_COMPLETED:
        return {
          ...state,
          status: 'PICKING_COMPLETED',
          pickingCompletedAt: event.timestamp,
        };

      case OrderEventType.PICKING_FAILED:
        return {
          ...state,
          status: 'PICKING_FAILED',
          pickingFailedAt: event.timestamp,
          pickingFailureReason: event.data.reason,
        };

      default:
        return state;
    }
  }

  /**
   * Obter histórico de eventos de uma encomenda
   */
  async getEventHistory(orderId: string): Promise<OrderEvent[]> {
    return prisma.$queryRawUnsafe(
      `SELECT * FROM order_events WHERE order_id = $1 ORDER BY aggregate_version ASC`,
      orderId
    ) as Promise<OrderEvent[]>;
  }
}

export const eventStore = new EventStore();
