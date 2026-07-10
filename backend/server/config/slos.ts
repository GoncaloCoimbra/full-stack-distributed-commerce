/**
 * Service Level Objectives (SLOs) & Service Level Indicators (SLIs)
 * Define objetivos de performance e alertas baseados em Google SRE Book
 */

export interface SLO {
  name: string;
  description: string;
  target: number; // Percentagem (ex: 99.5)
  window: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  errorBudget: number; // Percentagem de erro permitida
}

export interface SLI {
  metric: string;
  query: string; // Prometheus query
  threshold: number;
  alertSeverity: 'warning' | 'critical';
}

/**
 * SLOs definidos para Tranzor B2B
 */
export const SLOs: Record<string, SLO> = {
  CHECKOUT_LATENCY: {
    name: 'Checkout Latency',
    description: 'P99 latência de checkout deve ser < 200ms',
    target: 99.5,
    window: 'daily',
    errorBudget: 0.5, // 0.5% erro permitido
  },

  PAYMENT_SUCCESS_RATE: {
    name: 'Payment Success Rate',
    description: 'Taxa de sucesso de pagamentos deve ser > 98%',
    target: 98.0,
    window: 'daily',
    errorBudget: 2.0,
  },

  API_AVAILABILITY: {
    name: 'API Availability',
    description: 'API deve ter uptime de 99.95%',
    target: 99.95,
    window: 'monthly',
    errorBudget: 0.05, // ~22 minutos/mês
  },

  DATABASE_LATENCY: {
    name: 'Database Query Latency',
    description: 'P95 latência de query < 100ms',
    target: 95.0,
    window: 'daily',
    errorBudget: 5.0,
  },

  CACHE_HIT_RATE: {
    name: 'Cache Hit Rate',
    description: 'Hit rate do Redis deve ser > 85%',
    target: 85.0,
    window: 'daily',
    errorBudget: 15.0,
  },

  ORDER_PROCESSING: {
    name: 'Order Processing Time',
    description: 'Processamento de encomenda completa < 5 segundos (P99)',
    target: 99.0,
    window: 'daily',
    errorBudget: 1.0,
  },
};

/**
 * SLIs (Service Level Indicators) - métricas específicas
 */
export const SLIs: Record<string, SLI> = {
  HTTP_REQUEST_LATENCY: {
    metric: 'http_request_duration_ms',
    query: `histogram_quantile(0.99, rate(http_request_duration_ms_bucket[5m]))`,
    threshold: 200, // ms
    alertSeverity: 'warning',
  },

  PAYMENT_FAILURE_RATE: {
    metric: 'payment_failures_total',
    query: `rate(payment_failures_total[5m]) / rate(payment_attempts_total[5m]) * 100`,
    threshold: 2.0, // %
    alertSeverity: 'critical',
  },

  API_ERROR_RATE: {
    metric: 'http_requests_total',
    query: `rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) * 100`,
    threshold: 0.1, // %
    alertSeverity: 'critical',
  },

  DATABASE_CONNECTION_POOL: {
    metric: 'db_connection_pool_active',
    query: `db_connection_pool_active / db_connection_pool_size * 100`,
    threshold: 80.0, // %
    alertSeverity: 'warning',
  },

  REDIS_MEMORY_USAGE: {
    metric: 'redis_memory_used_bytes',
    query: `redis_memory_used_bytes / redis_memory_max_bytes * 100`,
    threshold: 85.0, // %
    alertSeverity: 'warning',
  },

  CACHE_HIT_RATIO: {
    metric: 'cache_hits',
    query: `rate(cache_hits_total[5m]) / (rate(cache_hits_total[5m]) + rate(cache_misses_total[5m])) * 100`,
    threshold: 85.0, // %
    alertSeverity: 'warning',
  },

  CHECKOUT_SUCCESS_RATE: {
    metric: 'checkout_success',
    query: `rate(checkout_success_total[5m]) / rate(checkout_attempts_total[5m]) * 100`,
    threshold: 98.0, // %
    alertSeverity: 'critical',
  },

  ORDER_QUEUE_LENGTH: {
    metric: 'order_queue_length',
    query: `bullmq_queue_length{queue="checkout-saga"}`,
    threshold: 50, // encomendas pendentes
    alertSeverity: 'warning',
  },
};

/**
 * Prometheus Rules para alertas automáticos
 * Salvar como prometheus-rules.yml e carregar no Prometheus
 */
export const PROMETHEUS_ALERT_RULES = `
groups:
  - name: Tranzor_slos
    interval: 1m
    rules:
      # SLO: Checkout Latency
      - alert: HighCheckoutLatency
        expr: |
          histogram_quantile(0.99, rate(http_request_duration_ms_bucket{endpoint="/api/v1/orders/checkout"}[5m])) > 200
        for: 5m
        labels:
          severity: warning
          slo: checkout_latency
        annotations:
          summary: "Checkout latency P99 > 200ms"
          description: "Latência de checkout está acima do SLO target de 200ms"

      # SLO: Payment Success Rate
      - alert: LowPaymentSuccessRate
        expr: |
          (rate(payment_failures_total[5m]) / rate(payment_attempts_total[5m])) * 100 > 2
        for: 5m
        labels:
          severity: critical
          slo: payment_success_rate
        annotations:
          summary: "Payment success rate < 98%"
          description: "Taxa de sucesso de pagamentos está abaixo de 98%"

      # SLO: API Availability
      - alert: HighAPIErrorRate
        expr: |
          (rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m])) * 100 > 0.1
        for: 5m
        labels:
          severity: critical
          slo: api_availability
        annotations:
          summary: "API error rate > 0.1%"
          description: "Taxa de erros da API está muito alta"

      # SLO: Database Latency
      - alert: HighDatabaseLatency
        expr: |
          histogram_quantile(0.95, rate(db_query_duration_ms_bucket[5m])) > 100
        for: 5m
        labels:
          severity: warning
          slo: database_latency
        annotations:
          summary: "Database query P95 latency > 100ms"
          description: "Latência de queries do PostgreSQL está elevada"

      # SLO: Cache Hit Rate
      - alert: LowCacheHitRate
        expr: |
          (rate(cache_hits_total[5m]) / (rate(cache_hits_total[5m]) + rate(cache_misses_total[5m]))) * 100 < 85
        for: 10m
        labels:
          severity: warning
          slo: cache_hit_rate
        annotations:
          summary: "Cache hit rate < 85%"
          description: "Taxa de acerto do cache está abaixo do target"

      # Error Budget Burn Rate (Fast)
      - alert: ErrorBudgetBurnRateFast
        expr: |
          (1 - (rate(http_requests_total{status=~"2.."}[1h]) / rate(http_requests_total[1h]))) * 100 > 10
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Error budget burn rate muito rápido (1h)"
          description: "Ao ritmo atual, será ultrapassado o error budget do mês em dias"

      # Checkout Queue Too Long
      - alert: CheckoutQueueTooLong
        expr: bullmq_queue_length{queue="checkout-saga"} > 50
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Checkout queue length > 50"
          description: "Fila de checkout tem mais de 50 encomendas pendentes"

      # Redis Memory Critical
      - alert: RedisMemoryCritical
        expr: |
          (redis_memory_used_bytes / redis_memory_max_bytes) * 100 > 90
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Redis memory usage > 90%"
          description: "Uso de memória do Redis está crítico"
`;

/**
 * Calcular Error Budget Burn Rate
 * Usado para detectar se o sistema está queimando o orçamento de erro rápido demais
 */
export function calculateErrorBudgetBurnRate(
  successRate: number,
  sloBudget: number,
  window: 'hourly' | 'daily' | 'monthly' = 'monthly'
): {
  burnRate: number;
  severity: 'normal' | 'warning' | 'critical';
  daysUntilBudgetExhausted: number;
} {
  const errorRate = 100 - successRate;
  const allowedErrorRate = 100 - sloBudget;
  const burnRate = errorRate / allowedErrorRate;

  let windowDays = 1;
  if (window === 'monthly') windowDays = 30;

  const daysUntilBudgetExhausted = burnRate > 0 ? windowDays / burnRate : Infinity;

  let severity: 'normal' | 'warning' | 'critical' = 'normal';
  if (daysUntilBudgetExhausted < 7) severity = 'critical';
  else if (daysUntilBudgetExhausted < 14) severity = 'warning';

  return {
    burnRate,
    severity,
    daysUntilBudgetExhausted,
  };
}
