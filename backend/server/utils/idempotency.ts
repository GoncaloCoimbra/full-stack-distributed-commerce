import { clearCachedValue, getCachedValue, setCachedValue } from './cache';

const IDEMPOTENCY_TTL_MS = 5 * 60 * 1000;

export interface IdempotencyRecord<T> {
  status: 'processing' | 'completed';
  statusCode: number;
  response: T;
  createdAt: number;
}

function buildKey(key: string): string {
  return `idempotency:${key}`;
}

export async function getIdempotencyRecord<T>(key: string): Promise<IdempotencyRecord<T> | null> {
  return getCachedValue<IdempotencyRecord<T>>(buildKey(key));
}

export async function setIdempotencyProcessing(key: string): Promise<void> {
  await setCachedValue(buildKey(key), {
    status: 'processing',
    statusCode: 202,
    response: null,
    createdAt: Date.now(),
  }, IDEMPOTENCY_TTL_MS);
}

export async function setIdempotencyResult<T>(key: string, payload: { statusCode: number; response: T }): Promise<void> {
  await setCachedValue(buildKey(key), {
    status: 'completed',
    statusCode: payload.statusCode,
    response: payload.response,
    createdAt: Date.now(),
  }, IDEMPOTENCY_TTL_MS);
}

export async function clearIdempotencyRecord(key: string): Promise<void> {
  await clearCachedValue(buildKey(key));
}
