import { apiClient } from './apiClient';

export type AnalyticsEventName =
  | 'page_view'
  | 'product_viewed'
  | 'cart_add'
  | 'cart_coupon_applied'
  | 'checkout_started'
  | 'checkout_step_viewed'
  | 'checkout_submit_attempted'
  | 'checkout_completed'
  | 'compare_opened'
  | 'upsell_viewed'
  | 'upsell_added'
  | 'experiment_exposed';

export interface AnalyticsEvent {
  name: AnalyticsEventName;
  ts: number;
  path: string;
  metadata?: Record<string, unknown>;
}

const STORAGE_KEY = 'Tranzor:analytics-events';
const SESSION_KEY = 'Tranzor:analytics-session';
const MAX_EVENTS = 200;

let isSyncing = false;
let syncQueued = false;

function getSessionId() {
  if (typeof window === 'undefined') {
    return 'server-side';
  }

  const existing = window.localStorage.getItem(SESSION_KEY);
  if (existing) {
    return existing;
  }

  const created = window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  window.localStorage.setItem(SESSION_KEY, created);
  return created;
}

function getCurrentChannel() {
  if (typeof window === 'undefined') {
    return 'Direct';
  }

  const params = new URLSearchParams(window.location.search);
  return params.get('utm_source') || params.get('channel') || params.get('source') || 'Direct';
}

function getImplicitMetadata() {
  if (typeof window === 'undefined') {
    return {};
  }

  const productMatch = window.location.pathname.match(/^\/shop\/product\/([^/]+)$/);
  if (!productMatch) {
    return {};
  }

  return { productId: productMatch[1] };
}

function readQueue(): AnalyticsEvent[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistQueue(events: AnalyticsEvent[]) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events.slice(-MAX_EVENTS)));
  } catch {
    // localStorage pode estar indisponível.
  }
}

async function flushQueue() {
  if (typeof window === 'undefined' || isSyncing) {
    syncQueued = true;
    return;
  }

  const queue = readQueue();
  if (queue.length === 0) {
    return;
  }

  isSyncing = true;

  try {
    const response = await apiClient.post('/analytics/events', {
      events: queue,
      sessionId: getSessionId(),
    });

    if (response.success) {
      clearAnalyticsQueue();
    }
  } catch {
    // Mantemos a fila local para reenvio posterior.
  } finally {
    isSyncing = false;
    if (syncQueued) {
      syncQueued = false;
      void flushQueue();
    }
  }
}

export function trackEvent(name: AnalyticsEventName, metadata?: Record<string, unknown>) {
  if (typeof window === 'undefined') {
    return;
  }

  const enrichedMetadata = {
    ...getImplicitMetadata(),
    ...(metadata ?? {}),
    channel: getCurrentChannel(),
  };

  const event: AnalyticsEvent = {
    name,
    ts: Date.now(),
    path: window.location.pathname,
    metadata: enrichedMetadata,
  };

  const queue = readQueue();
  queue.push(event);
  persistQueue(queue);

  window.dispatchEvent(new CustomEvent('Tranzor:analytics-event', { detail: event }));

  void flushQueue();

  if (import.meta.env.DEV) {
    console.debug('[Tranzor analytics]', event);
  }
}

export function getAnalyticsQueue() {
  return readQueue();
}

export function clearAnalyticsQueue() {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // noop
  }
}

export function flushAnalyticsQueue() {
  void flushQueue();
}
