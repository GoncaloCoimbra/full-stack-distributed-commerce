/**
 * OpenTelemetry Data Tracing
 * Instrumentação nativa de queries SQL com rastreamento de latência e contexto.
 * Integra-se com Prometheus e Jaeger para observabilidade completa.
 */

import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';
import { SpanStatusCode, trace } from '@opentelemetry/api';
import { env } from '../config/env';

export class TelemetryTracer {
  private tracer: any;

  constructor() {
    const resource = resourceFromAttributes({
      [ATTR_SERVICE_NAME]: 'Tranzor-backend',
      [ATTR_SERVICE_VERSION]: '2.0.0',
      environment: env.NODE_ENV,
    });

    const sdk = new NodeSDK({
      resource,
      serviceName: 'Tranzor-backend',
      instrumentations: [getNodeAutoInstrumentations()],
      traceExporter: env.JAEGER_ENDPOINT ? new JaegerExporter({ endpoint: env.JAEGER_ENDPOINT }) : undefined,
    });

    sdk.start();
    this.tracer = trace.getTracer('Tranzor-tracer');
  }

  /**
   * Rastrear uma query SQL com latência e parâmetros
   */
  traceQuery(
    query: string,
    params?: any[],
    source?: string
  ): { endSpan: (result?: any, error?: Error) => void } {
    const span = this.tracer.startSpan(`db.query`, {
      attributes: {
        'db.system': 'postgresql',
        'db.operation': this.extractOperation(query),
        'db.statement': this.sanitizeQuery(query),
        'db.params.count': params?.length || 0,
        'code.filepath': source,
      },
    });

    const startTime = Date.now();

    return {
      endSpan: (result?: any, error?: Error) => {
        const duration = Date.now() - startTime;

        span.setAttributes({
          'db.duration_ms': duration,
          'db.result_rows': Array.isArray(result) ? result.length : 1,
          'db.success': !error,
        });

        if (error) {
          span.recordException(error);
          span.setStatus({ code: SpanStatusCode.ERROR });
        }

        span.end();
      },
    };
  }

  /**
   * Rastrear uma operação HTTP com contexto distribuído
   */
  traceHttpRequest(method: string, path: string, userId?: string) {
    const span = this.tracer.startSpan(`http.request`, {
      attributes: {
        'http.method': method,
        'http.url': path,
        'http.user_id': userId,
        'span.kind': 'server',
      },
    });

    const startTime = Date.now();

    return {
      endSpan: (statusCode: number, responseTime?: number) => {
        span.setAttributes({
          'http.status_code': statusCode,
          'http.response_time_ms': responseTime || Date.now() - startTime,
          'http.success': statusCode < 400,
        });

        span.end();
      },
    };
  }

  /**
   * Rastrear um processamento de Saga
   */
  traceSaga(sagaId: string, step: string) {
    const span = this.tracer.startSpan(`saga.step`, {
      attributes: {
        'saga.id': sagaId,
        'saga.step': step,
        'span.kind': 'internal',
      },
    });

    return {
      endSpan: (success: boolean, error?: Error) => {
        span.setAttributes({
          'saga.success': success,
        });

        if (error) {
          span.recordException(error);
          span.setStatus({ code: SpanStatusCode.ERROR });
        }

        span.end();
      },
    };
  }

  /**
   * Extrair tipo de operação da query SQL
   */
  private extractOperation(query: string): string {
    const match = query.match(/^\s*(SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER)/i);
    return match ? match[1].toUpperCase() : 'UNKNOWN';
  }

  /**
   * Sanitizar query para não expor dados sensíveis em logs
   */
  private sanitizeQuery(query: string): string {
    return query
      .replace(/\$\d+/g, '?') // Substituir parâmetros
      .substring(0, 500); // Limitar tamanho
  }

  /**
   * Obter tracer global
   */
  getTracer() {
    return this.tracer;
  }
}

/**
 * Middleware do Prisma para rastreamento automático
 */
export const telemetryMiddleware = (telemetry: TelemetryTracer) => {
  return async (params: any, next: (params: any) => Promise<any>) => {
    const query = params.args?.$queryRaw || params.query || 'unknown';
    const source = params.runInTransaction ? 'transaction' : 'direct';

    const span = telemetry.traceQuery(query, undefined, source);

    try {
      const result = await next(params);
      span.endSpan(result);
      return result;
    } catch (error: any) {
      span.endSpan(undefined, error);
      throw error;
    }
  };
};

export const telemetry = new TelemetryTracer();
