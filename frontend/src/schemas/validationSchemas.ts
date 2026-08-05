import { z } from 'zod';

/**
 * Auth Validation Schemas - Frontend
 */

export const loginSchema = z.object({
	email: z.string().email('Email deve ser válido'),
	password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

export const registerSchema = z.object({
	name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
	email: z.string().email('Email deve ser válido'),
	password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
	confirmPassword: z.string(),	agreeTerms: z.boolean().refine((value) => value === true, {
		message: 'É necessário aceitar os termos e condições'
	}),}).refine((data) => data.password === data.confirmPassword, {
	message: 'As senhas não correspondem',
	path: ['confirmPassword'],
});

export const productFilterSchema = z.object({
	category: z.string().optional(),
	minPrice: z.coerce.number().min(0).optional(),
	maxPrice: z.coerce.number().min(0).optional(),
	search: z.string().optional(),
	page: z.coerce.number().min(1).default(1),
	limit: z.coerce.number().min(1).max(100).default(20),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProductFilter = z.infer<typeof productFilterSchema>;
