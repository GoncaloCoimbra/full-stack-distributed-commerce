import Queue from 'bull';
import { env } from '../config/env';

const isTestMode = () => {
  return (
    process.env.NODE_ENV === 'test' ||
    env.NODE_ENV === 'test' ||
    process.env.JEST_WORKER_ID !== undefined ||
    process.argv.some((arg) => /jest|ts-jest/i.test(arg)) ||
    process.env.npm_lifecycle_event === 'test'
  );
};

const shouldUseRedisQueue = () => {
  if (process.env.DISABLE_REDIS === 'true' || isTestMode()) {
    return false;
  }

  const redisUrl = process.env.REDIS_URL?.trim() || env.REDIS_URL?.trim();
  return Boolean(redisUrl);
};

export interface QueueJob<T = any> {
  id: string;
  data: T;
  attemptsMade: number;
  progress: (value: number) => void;
  finished: () => Promise<any>;
  complete: (value?: any) => void;
  fail: (reason?: unknown) => void;
}

export type QueueProcessor<T = any> = (job: QueueJob<T>) => Promise<any>;

export interface QueueLike<T = any> {
  process(handler: QueueProcessor<T>): void;
  add(data: T, opts?: any): Promise<QueueJob<T>>;
  getJobs?(statuses?: string[]): Promise<QueueJob<T>[]>;
  clean?(...args: any[]): Promise<any>;
  on(event: string, listener: (...args: any[]) => void): void;
}

class MemoryJob<T = any> implements QueueJob<T> {
  public id: string;
  public data: T;
  public attemptsMade = 0;
  private finishedPromise: Promise<any>;
  private resolveFinished!: (value: any) => void;
  private rejectFinished!: (reason?: unknown) => void;

  constructor(data: T, id: string) {
    this.id = id;
    this.data = data;
    this.finishedPromise = new Promise((resolve, reject) => {
      this.resolveFinished = resolve;
      this.rejectFinished = reject;
    });
  }

  progress(_: number) {
    return;
  }

  finished() {
    return this.finishedPromise;
  }

  complete(value: any) {
    this.resolveFinished(value);
  }

  fail(reason: unknown) {
    this.rejectFinished(reason);
  }
}

class MemoryQueue<T = any> implements QueueLike<T> {
  private processor?: QueueProcessor<T>;
  private listeners = new Map<string, Array<(...args: any[]) => void>>();
  private counter = 0;

  process(handler: QueueProcessor<T>) {
    this.processor = handler;
  }

  on(event: string, listener: (...args: any[]) => void) {
    const listeners = this.listeners.get(event) || [];
    listeners.push(listener);
    this.listeners.set(event, listeners);
  }

  async add(data: T, _opts?: any): Promise<QueueJob<T>> {
    const job = new MemoryJob<T>(data, `memory-${Date.now()}-${this.counter++}`);

    if (this.processor) {
      try {
        const result = await this.processor(job);
        job.complete(result);
        this.emit('completed', job, result);
      } catch (error) {
        job.fail(error);
        this.emit('failed', job, error);
      }
    } else {
      job.complete(undefined);
      this.emit('completed', job, undefined);
    }

    return job;
  }

  async getJobs(_statuses?: string[]): Promise<QueueJob<T>[]> {
    return [];
  }

  async clean(..._args: any[]) {
    return [];
  }

  private emit(event: string, ...args: any[]) {
    const listeners = this.listeners.get(event) || [];
    for (const listener of listeners) {
      try {
        listener(...args);
      } catch {
        // Ignore listener failures in tests.
      }
    }
  }
}

export function createBullQueue(queueName: string, redisUrl = process.env.REDIS_URL?.trim() || env.REDIS_URL?.trim() || 'redis://localhost:6379'): QueueLike<any> {
  if (!shouldUseRedisQueue()) {
    return new MemoryQueue<any>();
  }

  return new Queue(queueName, redisUrl as string) as unknown as QueueLike<any>;
}

export const checkoutQueue = createBullQueue('checkout-saga');
