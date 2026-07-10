import { Router } from 'express';
import { env } from '../config/env';

const router = Router();

/**
 * @openapi
 * /api/v1/tenant/config:
 *   get:
 *     summary: Tenant branding configuration
 *     responses:
 *       200:
 *         description: Tenant configuration returned from environment variables
 */
router.get('/config', (_req, res) => {
  res.json({
    success: true,
    tenant: {
      brandName: env.TENANT_BRAND_NAME,
      logoUrl: env.TENANT_LOGO_URL,
      currency: env.TENANT_CURRENCY,
      timezone: env.TENANT_TIMEZONE,
    },
  });
});

export default router;
