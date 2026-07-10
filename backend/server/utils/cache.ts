import Redis from 'ioredis';
import { incrementBusinessMetric } from './metrics';

type CacheRecord<T> = {
  value: T;
  expiresAt: number;
};

const memoryCache = new Map<string, CacheRecord<unknown>>();
let redisClient: Redis | null | undefined;

function getRedisUrl() {
  return process.env.REDIS_URL?.trim() || '';
}

function shouldUseRedis() {
  const redisDisabled = process.env.DISABLE_REDIS === 'true' || process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID !== undefined;
  return Boolean(getRedisUrl()) && !redisDisabled;
}

export async function getRedisClient() {
  if (!shouldUseRedis()) {
    return null;
  }

  if (redisClient === undefined) {
    try {
      redisClient = new Redis(getRedisUrl(), {
        lazyConnect: true,
        maxRetriesPerRequest: 1,
      });
      redisClient.on('error', () => {
        redisClient = null;
      });
      await redisClient.connect();
    } catch {
      redisClient = null;
    }
  }

  if (!redisClient) {
    return null;
  }

  if (redisClient.status !== 'ready') {
    try {
      await redisClient.connect();
    } catch {
      redisClient = null;
      return null;
    }
  }

  return redisClient;
}

export async function disconnectRedis() {
  if (!redisClient) {
    return;
  }

  try {
    await redisClient.quit();
  } catch {
    await redisClient.disconnect();
  } finally {
    redisClient = null;
  }
}

export async function getCacheStatus() {
  const configured = Boolean(getRedisUrl());

  if (!configured || process.env.NODE_ENV === 'test') {
    return {
      configured,
      connected: false,
      source: 'memory',
    };
  }

  const client = await getRedisClient();

  if (!client) {
    return {
      configured,
      connected: false,
      source: 'memory',
    };
  }

  try {
    await client.ping();
    return {
      configured,
      connected: true,
      source: 'redis',
    };
  } catch {
    return {
      configured,
      connected: false,
      source: 'memory',
    };
  }
}

function isExpired(cached: CacheRecord<unknown> | undefined) {
  return !cached || cached.expiresAt <= Date.now();
}

function getMemoryCachedValue<T>(key: string): T | null {
  const cached = memoryCache.get(key);

  if (isExpired(cached as CacheRecord<unknown> | undefined)) {
    if (cached) {
      memoryCache.delete(key);
    }
    return null;
  }

  return cached?.value as T;
}

export async function getCachedValue<T>(key: string): Promise<T | null> {
  const cached = getMemoryCachedValue<T>(key);
  if (cached !== null) {
    incrementBusinessMetric('cacheHitCount');
    return cached;
  }

  const client = await getRedisClient();
  if (!client) {
    incrementBusinessMetric('cacheMissCount');
    return null;
  }

  try {
    const redisValue = await client.get(key);
    if (!redisValue) {
      incrementBusinessMetric('cacheMissCount');
      return null;
    }

    const parsedPayload = JSON.parse(redisValue) as { value: T; expiresAt: number };
    if (!parsedPayload || parsedPayload.expiresAt <= Date.now()) {
      memoryCache.delete(key);
      return null;
    }

    memoryCache.set(key, {
      value: parsedPayload.value,
      expiresAt: parsedPayload.expiresAt,
    });

    return parsedPayload.value;
  } catch {
    return null;
  }
}

export async function setCachedValue<T>(key: string, value: T, ttlMs: number): Promise<void> {
  const expiresAt = Date.now() + ttlMs;
  memoryCache.set(key, {
    value,
    expiresAt,
  });

  const client = await getRedisClient();
  if (!client) {
    return;
  }

  try {
    await client.set(key, JSON.stringify({ value, expiresAt }), 'PX', ttlMs);
  } catch {
    // Fallback to local cache only when Redis is unavailable.
  }
}

export async function clearCachedValue(key: string): Promise<void> {
  memoryCache.delete(key);

  const client = await getRedisClient();
  if (!client) {
    return;
  }

  try {
    await client.del(key);
  } catch {
    // Ignore Redis cleanup failures.
  }
}

export async function clearCacheByPrefix(prefix: string): Promise<void> {
  for (const key of memoryCache.keys()) {
    if (key.startsWith(prefix)) {
      memoryCache.delete(key);
    }
  }

  const client = await getRedisClient();
  if (!client) {
    return;
  }

  try {
    const keys = await client.keys(`${prefix}*`);
    if (keys.length > 0) {
      await client.del(keys);
    }
  } catch {
    // Ignore Redis invalidation failures.
  }
}

export async function clearProductCache(productId: string): Promise<void> {
  const cacheKeys = Array.from(memoryCache.keys()).filter((key) => key.includes(`product:${productId}`) || key.includes(productId));
  for (const key of cacheKeys) {
    memoryCache.delete(key);
  }

  const client = await getRedisClient();
  if (!client) {
    return;
  }

  try {
    const keys = await client.keys(`product:${productId}*`);
    if (keys.length > 0) {
      await client.del(keys);
    }
  } catch {
    // Ignore Redis cleanup failures.
  }
}
