import { z } from 'zod';

export const addCartItemSchema = z.object({
  productId: z.string().min(1, 'ID do produto é obrigatório'),
  quantity: z.number().int().min(1, 'Quantidade deve ser no mínimo 1').default(1),
  variants: z.record(z.string(), z.string()).optional()
});

export const updateCartItemSchema = z.object({
  productId: z.string().min(1, 'ID do produto é obrigatório'),
  quantity: z.number().int().min(1, 'Quantidade deve ser no mínimo 1')
});

export const removeCartItemSchema = z.object({
  productId: z.string().min(1, 'ID do produto é obrigatório')
});
