/**
 * ClickHouse Analytics Pipeline
 * Canaliza eventos de negócio para ClickHouse para análise em tempo real.
 * ClickHouse é uma BD colunar ultra-rápida para OLAP (Online Analytical Processing).
 */

import axios, { AxiosInstance } from 'axios';
import { env } from '../config/env';

export interface AnalyticsEvent {
  timestamp: Date;
  eventType: string;
  userId: string;
  orderId?: string;
  orderValue?: number;
  currency?: string;
  paymentMethod?: string;
  itemCount?: number;
  averageItemPrice?: number;
  region?: string;
  companyRole?: string;
  metadata?: Record<string, any>;
}

export interface OrderMetrics {
  date: string;
  orderCount: number;
  totalRevenue: number;
  averageOrderValue: number;
  conversionRate: number;
  paymentSuccessRate: number;
  topPaymentMethods: Array<{ method: string; count: number }>;
}

export class ClickHouseAnalytics {
  private client: AxiosInstance | null = null;
  private readonly buffer: AnalyticsEvent[] = [];
  private readonly batchSize = 100;
  private flushInterval: NodeJS.Timeout | null = null;
  private readonly endpoint: string;

  constructor() {
    this.endpoint = env.CLICKHOUSE_HTTP_URL || 'http://localhost:8123';

    if (env.CLICKHOUSE_HTTP_URL) {
      this.client = axios.create({
        baseURL: this.endpoint,
        auth: {
          username: env.CLICKHOUSE_USER || 'default',
          password: env.CLICKHOUSE_PASSWORD || '',
        },
      });

      this.startFlushInterval();
    }
  }

  /**
   * Registar um evento de análise (buffered)
   */
  async logEvent(event: AnalyticsEvent): Promise<void> {
    this.buffer.push(event);

    if (this.buffer.length >= this.batchSize) {
      await this.flush();
    }
  }

  /**
   * Registar múltiplos eventos
   */
  async logEvents(events: AnalyticsEvent[]): Promise<void> {
    this.buffer.push(...events);

    if (this.buffer.length >= this.batchSize) {
      await this.flush();
    }
  }

  /**
   * Enviar eventos em buffer para ClickHouse
   */
  private async flush(): Promise<void> {
    if (!this.client || this.buffer.length === 0) {
      return;
    }

    try {
      const events = this.buffer.splice(0, this.batchSize);

      // Formato TSV para inserção eficiente
      const tsvData = events
        .map((event) =>
          [
            new Date(event.timestamp).toISOString(),
            event.eventType,
            event.userId,
            event.orderId || '',
            event.orderValue || 0,
            event.currency || 'EUR',
            event.paymentMethod || '',
            event.itemCount || 0,
            event.averageItemPrice || 0,
            event.region || '',
            event.companyRole || '',
            JSON.stringify(event.metadata || {}),
          ].join('\t')
        )
        .join('\n');

      await this.client.post(
        '/',
        tsvData,
        {
          params: {
            query: `INSERT INTO orders_analytics (
              timestamp, event_type, user_id, order_id, order_value,
              currency, payment_method, item_count, average_item_price,
              region, company_role, metadata
            ) FORMAT TSV`,
          },
        }
      );

      console.log(`✅ ${events.length} eventos enviados para ClickHouse`);
    } catch (error: any) {
      console.error('Erro ao enviar eventos para ClickHouse:', error.message);
      // Re-adicionar ao buffer em caso de erro
      this.buffer.unshift(...this.buffer.splice(0, this.batchSize));
    }
  }

  /**
   * Iniciar intervalo de flush automático (a cada 30 segundos)
   */
  private startFlushInterval(): void {
    this.flushInterval = setInterval(async () => {
      if (this.buffer.length > 0) {
        await this.flush();
      }
    }, 30000);
  }

  /**
   * Parar o intervalo de flush (chamar em graceful shutdown)
   */
  stopFlushInterval(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
  }

  /**
   * Consultar métricas de encomendas por período
   */
  async getOrderMetrics(fromDate: Date, toDate: Date): Promise<OrderMetrics[]> {
    if (!this.client) {
      return [];
    }

    try {
      const query = `
        SELECT
          toDate(timestamp) as date,
          countIf(event_type = 'ORDER_COMPLETED') as order_count,
          sumIf(order_value, event_type = 'ORDER_COMPLETED') as total_revenue,
          avgIf(order_value, event_type = 'ORDER_COMPLETED') as average_order_value,
          countIf(event_type = 'CHECKOUT_SUCCESS') / countIf(event_type = 'CHECKOUT_INITIATED') as conversion_rate,
          countIf(event_type = 'PAYMENT_APPROVED') / countIf(event_type = 'PAYMENT_INITIATED') as payment_success_rate,
          groupArray(Tuple(payment_method, count(*))) as payment_methods
        FROM orders_analytics
        WHERE timestamp >= toDateTime('${fromDate.toISOString()}')
          AND timestamp <= toDateTime('${toDate.toISOString()}')
        GROUP BY date
        ORDER BY date DESC
        FORMAT JSON
      `;

      const response = await this.client.get('/', {
        params: { query },
      });

      return response.data.data || [];
    } catch (error: any) {
      console.error('Erro ao consultar métricas de ClickHouse:', error.message);
      return [];
    }
  }

  /**
   * Consultar top produtos vendidos
   */
  async getTopProducts(limit: number = 10): Promise<Array<{ product: string; quantity: number }>> {
    if (!this.client) {
      return [];
    }

    try {
      const query = `
        SELECT
          metadata['product_name'] as product,
          sum(item_count) as quantity
        FROM orders_analytics
        WHERE event_type = 'ORDER_COMPLETED'
          AND timestamp >= now() - interval 30 day
        GROUP BY product
        ORDER BY quantity DESC
        LIMIT ${limit}
        FORMAT JSON
      `;

      const response = await this.client.get('/', {
        params: { query },
      });

      return response.data.data || [];
    } catch (error: any) {
      console.error('Erro ao consultar top produtos:', error.message);
      return [];
    }
  }

  /**
   * Análise de churn de clientes
   */
  async analyzeCustomerChurn(daysAgo: number = 90): Promise<{
    totalCustomers: number;
    activeCustomers: number;
    churnRate: number;
  }> {
    if (!this.client) {
      return { totalCustomers: 0, activeCustomers: 0, churnRate: 0 };
    }

    try {
      const query = `
        WITH customer_stats AS (
          SELECT
            user_id,
            max(timestamp) as last_order,
            count(*) as order_count
          FROM orders_analytics
          WHERE event_type = 'ORDER_COMPLETED'
            AND timestamp >= now() - interval ${daysAgo} day
          GROUP BY user_id
        )
        SELECT
          count(DISTINCT user_id) as total_customers,
          countIf(last_order >= now() - interval 30 day) as active_customers,
          (1 - (countIf(last_order >= now() - interval 30 day) / count(*))) as churn_rate
        FROM customer_stats
        FORMAT JSON
      `;

      const response = await this.client.get('/', {
        params: { query },
      });

      return response.data.data[0] || { totalCustomers: 0, activeCustomers: 0, churnRate: 0 };
    } catch (error: any) {
      console.error('Erro ao analisar churn:', error.message);
      return { totalCustomers: 0, activeCustomers: 0, churnRate: 0 };
    }
  }

  /**
   * Health check do ClickHouse
   */
  async healthCheck(): Promise<boolean> {
    if (!this.client) {
      return false;
    }

    try {
      await this.client.get('/', {
        params: { query: 'SELECT 1' },
      });
      return true;
    } catch {
      return false;
    }
  }
}

export const clickhouseAnalytics = new ClickHouseAnalytics();
