import { env } from '../config/env';

export async function dispatchWebhookEvent(eventType: string, payload: Record<string, unknown>) {
  const destinations = env.WEBHOOK_TARGET_URLS
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);

  const envelope = {
    eventType,
    occurredAt: new Date().toISOString(),
    payload,
  };

  const results: Array<{ url: string; status: number; ok: boolean }> = [];

  for (const url of destinations) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Event-Type': eventType,
        },
        body: JSON.stringify(envelope),
      });

      results.push({ url, status: response.status, ok: response.ok });
    } catch (error) {
      results.push({ url, status: 0, ok: false });
    }
  }

  return {
    eventType,
    delivered: results.filter((item) => item.ok).length,
    failed: results.filter((item) => !item.ok).length,
    results,
  };
}
