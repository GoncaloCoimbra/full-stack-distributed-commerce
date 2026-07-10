import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ValidationError } from '../utils/errors';

/**
 * Request body validation middleware using Zod
 * Usage: router.post('/endpoint', validate(schema), handler)
 */
export function validate(schema: ZodSchema) {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			const validated = await schema.parseAsync(req.body);
			req.body = validated;
			next();
		} catch (error) {
			if (error instanceof ZodError) {
				const errors: Record<string, string[]> = {};
				error.issues.forEach((issue) => {
					const path = issue.path.join('.');
					if (!errors[path]) {
						errors[path] = [];
					}
					errors[path].push(issue.message);
				});
				return next(new ValidationError('Validação de dados falhou', errors));
			}
			return next(error);
		}
	};
}

/**
 * Query parameters validation middleware using Zod
 * Usage: router.get('/endpoint', validateQuery(schema), handler)
 */
export function validateQuery(schema: ZodSchema) {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			const validated = await schema.parseAsync(req.query);
			req.query = validated as any;
			next();
		} catch (error) {
			if (error instanceof ZodError) {
				const errors: Record<string, string[]> = {};
				error.issues.forEach((issue) => {
					const path = issue.path.join('.');
					if (!errors[path]) {
						errors[path] = [];
					}
					errors[path].push(issue.message);
				});
				return next(new ValidationError('Query parameters inválidos', errors));
			}
			return next(error);
		}
	};
}

/**
 * URL parameters validation middleware using Zod
 * Usage: router.get('/endpoint/:id', validateParams(schema), handler)
 */
export function validateParams(schema: ZodSchema) {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			const validated = await schema.parseAsync(req.params);
			req.params = validated as any;
			next();
		} catch (error) {
			if (error instanceof ZodError) {
				const errors: Record<string, string[]> = {};
				error.issues.forEach((issue) => {
					const path = issue.path.join('.');
					if (!errors[path]) {
						errors[path] = [];
					}
					errors[path].push(issue.message);
				});
				return next(new ValidationError('Parâmetros de URL inválidos', errors));
			}
			return next(error);
		}
	};
}