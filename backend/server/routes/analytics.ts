import { Router } from 'express';
import { z } from 'zod';
import AnalyticsEvent from '../models/AnalyticsEvent';

const analyticsEventSchema = z.object({
  name: z.string().min(1),
  ts: z.number(),
  path: z.string().min(1),
  metadata: z.record(z.any()).optional(),
});

const analyticsBatchSchema = z.object({
  events: z.array(analyticsEventSchema).min(1),
  sessionId: z.string().optional(),
});

const router = Router();

router.post('/events', async (req, res) => {
  const parsed = analyticsBatchSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: 'Payload inválido para analytics',
      details: parsed.error.flatten(),
    });
  }

  const { events, sessionId } = parsed.data;
  const stored = await Promise.all(
    events.map((event) =>
      AnalyticsEvent.create({
        event: event.name,
        meta: {
          path: event.path,
          ts: event.ts,
          ...(event.metadata ?? {}),
        },
        anonymousId: sessionId || `anon-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      })
    )
  );

  return res.json({
    success: true,
    stored: stored.length,
  });
});

export default router;
