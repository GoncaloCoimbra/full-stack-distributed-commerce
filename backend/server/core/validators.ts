import { z } from 'zod';

export const productCreateSchema = z.object({
  sku: z.string().trim().min(3),
  name: z.string().trim().min(3),
  description: z.string().trim().min(10),
  price: z.number().positive(),
  cost: z.number().nonnegative().optional(),
  stock: z.number().int().nonnegative().default(0),
  categoryId: z.string().trim().min(1),
  slug: z.string().trim().min(1),
});

export const catalogImportItemSchema = z.object({
  family: z.string().trim().min(2),
  category: z.string().trim().min(2),
  sku_prefix: z.string().trim().regex(/^[A-Z0-9-]{3,20}$/),
  description: z.string().trim().min(10),
  unit_price: z.number().positive(),
  stock: z.number().int().nonnegative(),
  tags: z.array(z.string().trim().min(1)).default([]),
  featured: z.boolean().default(false),
});

export const catalogImportSchema = z.array(catalogImportItemSchema);

export type CatalogImportRow = z.infer<typeof catalogImportItemSchema>;
