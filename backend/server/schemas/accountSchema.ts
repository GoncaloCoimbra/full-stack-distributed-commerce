import { z } from 'zod';

const addressSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(8, 'Telefone inválido'),
  street: z.string().min(1, 'Rua é obrigatória'),
  city: z.string().min(1, 'Cidade é obrigatória'),
  postalCode: z.string().min(2, 'Código postal inválido'),
  country: z.string().min(2, 'País é obrigatório')
});

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').optional(),
  phone: z.string().optional(),
  address: addressSchema.optional()
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(8, 'Password atual deve ter no mínimo 8 caracteres'),
  newPassword: z.string().min(8, 'Nova password deve ter no mínimo 8 caracteres'),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'As senhas não correspondem',
  path: ['confirmPassword']
});

export const createOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string().min(1, 'ID do produto é obrigatório'),
    quantity: z.number().int().min(1, 'Quantidade deve ser no mínimo 1'),
    variants: z.record(z.string(), z.string()).optional()
  })).min(1, 'A encomenda deve conter pelo menos um item'),
  shippingAddress: addressSchema,
  billingAddress: addressSchema.optional(),
  paymentMethod: z.string().min(1, 'Método de pagamento é obrigatório'),
  shippingMethod: z.string().min(1, 'Método de entrega é obrigatório'),
  shippingCost: z.number().min(0, 'Custo de entrega deve ser maior ou igual a 0').default(0),
  tax: z.number().min(0, 'Taxa deve ser maior ou igual a 0').default(0),
  discount: z.number().min(0, 'Desconto deve ser maior ou igual a 0').default(0),
  loyaltyPointsUsed: z.number().min(0, 'Pontos utilizados devem ser maior ou igual a 0').default(0),
  notes: z.string().max(1000, 'Notas podem ter até 1000 caracteres').optional()
});

export const updateAddressSchema = z.object({
  address: addressSchema
});

export const deactivateAccountSchema = z.object({
  password: z.string().min(8, 'Password é obrigatória para desativar a conta'),
  reason: z.string().max(500, 'Motivo pode ter até 500 caracteres').optional()
});
