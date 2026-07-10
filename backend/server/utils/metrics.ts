import { NextFunction, Request, Response } from 'express';

interface RouteMetric {
  count: number;
  totalLatencyMs: number;
  averageLatencyMs: number;
  lastStatusCode: number;
  lastResponseTimeMs: number;
  statusCodes: Record<string, number>;
}

interface BusinessMetrics {
  cacheHitCount: number;
  cacheMissCount: number;
  checkoutSuccessCount: number;
  checkoutFailureCount: number;
  stripeReconciliationChecks: number;
  saftExports: number;
}

interface MetricsState {
  startedAt: number;
  totalRequests: number;
  totalLatencyMs: number;
  requestsByRoute: Record<string, RouteMetric>;
}

const metricsState: MetricsState = {
  startedAt: Date.now(),
  totalRequests: 0,
  totalLatencyMs: 0,
  requestsByRoute: {},
};

const businessMetrics: BusinessMetrics = {
  cacheHitCount: 0,
  cacheMissCount: 0,
  checkoutSuccessCount: 0,
  checkoutFailureCount: 0,
  stripeReconciliationChecks: 0,
  saftExports: 0,
};

function getRouteKey(req: Request) {
  return `${req.method} ${req.path}`;
}

export function incrementBusinessMetric(metric: keyof BusinessMetrics, amount = 1) {
  if (businessMetrics[metric] !== undefined) {
    businessMetrics[metric] += amount;
  }
}

export function metricsMiddleware(req: Request, res: Response, next: NextFunction) {
  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;
    const routeKey = getRouteKey(req);
    const routeMetric = metricsState.requestsByRoute[routeKey] ?? {
      count: 0,
      totalLatencyMs: 0,
      averageLatencyMs: 0,
      lastStatusCode: 0,
      lastResponseTimeMs: 0,
      statusCodes: {},
    };

    routeMetric.count += 1;
    routeMetric.totalLatencyMs += durationMs;
    routeMetric.averageLatencyMs = routeMetric.totalLatencyMs / routeMetric.count;
    routeMetric.lastStatusCode = res.statusCode;
    routeMetric.lastResponseTimeMs = durationMs;
    routeMetric.statusCodes[String(res.statusCode)] = (routeMetric.statusCodes[String(res.statusCode)] ?? 0) + 1;

    metricsState.totalRequests += 1;
    metricsState.totalLatencyMs += durationMs;
    metricsState.requestsByRoute[routeKey] = routeMetric;
  });

  next();
}

export function getMetricsSnapshot() {
  return {
    startedAt: new Date(metricsState.startedAt).toISOString(),
    uptimeSeconds: Math.max(0, (Date.now() - metricsState.startedAt) / 1000),
    totalRequests: metricsState.totalRequests,
    totalLatencyMs: metricsState.totalLatencyMs,
    averageLatencyMs: metricsState.totalRequests > 0
      ? metricsState.totalLatencyMs / metricsState.totalRequests
      : 0,
    memoryUsage: process.memoryUsage(),
    requestsByRoute: metricsState.requestsByRoute,
    businessMetrics,
  };
}
