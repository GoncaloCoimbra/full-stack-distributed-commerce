import { Router } from 'express';
import Product from '../models/Product';

const router = Router();

/**
 * @openapi
 * /api/v1/feeds/marketing:
 *   get:
 *     summary: Generate marketing feed for marketplaces
 *     parameters:
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [json, xml]
 *     responses:
 *       200:
 *         description: Marketing feed generated
 */
router.get('/marketing', async (req, res) => {
  const format = typeof req.query.format === 'string' ? req.query.format.toLowerCase() : 'xml';
  const products = await Product.find({ isActive: true, isDeleted: false }).lean();

  if (format === 'json') {
    res.json({
      generatedAt: new Date().toISOString(),
      products: products.map((product) => ({
        sku: product.sku,
        name: product.name,
        description: product.description,
        price: product.price,
        inStock: product.inStock,
        stockQuantity: product.stockQuantity,
        category: product.category,
      })),
    });
    return;
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<feed xmlns="http://www.w3.org/2005/Atom">\n${products.map((product) => `  <entry>\n    <sku>${product.sku}</sku>\n    <name>${product.name}</name>\n    <price>${product.price}</price>\n    <stock>${product.stockQuantity ?? 0}</stock>\n  </entry>`).join('\n')}\n</feed>`;

  res.type('application/xml').send(xml);
});

export default router;
