import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

const SENSITIVE_KEYS = [
  'password',
  'token',
  'authorization',
  'creditCard',
  'cardNumber',
  'cvc',
  'cvv',
  'expMonth',
  'expYear',
  'ssn',
  'taxId',
  'socialSecurityNumber',
  'postalCode',
  'email',
  'phone',
  'street',
  'name'
];

function maskValue(value: unknown) {
  if (typeof value === 'string') {
    return value.length > 4 ? `${value.slice(0, 2)}...${value.slice(-2)}` : '****';
  }

  if (typeof value === 'number') {
    return '***';
  }

  if (typeof value === 'object' && value !== null) {
    return '[REDACTED]';
  }

  return '****';
}

function sanitizeObject(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sanitizeObject);
  }

  if (value && typeof value === 'object') {
    return Object.entries(value).reduce((acc, [key, val]) => {
      const lowerKey = key.toLowerCase();
      if (SENSITIVE_KEYS.some(sensitiveKey => lowerKey.includes(sensitiveKey))) {
        return { ...acc, [key]: maskValue(val) };
      }
      return { ...acc, [key]: sanitizeObject(val) };
    }, {} as Record<string, unknown>);
  }

  return value;
}

export function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
  const safeBody = sanitizeObject(req.body);
  const safeQuery = sanitizeObject(req.query);
  const safeHeaders = sanitizeObject({
    origin: req.headers.origin,
    referer: req.headers.referer,
    'user-agent': req.headers['user-agent'],
  });

  logger.info('Incoming request', {
    requestId: (req as any).id,
    method: req.method,
    path: req.originalUrl,
    ip: req.ip,
    userId: (req as any).user?.userId,
    body: safeBody,
    query: safeQuery,
    headers: safeHeaders,
  });

  next();
}