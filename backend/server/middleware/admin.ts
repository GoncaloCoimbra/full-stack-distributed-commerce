import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../utils/errors';

export interface AuthRequest extends Request {
	user?: {
		userId: string;
		role: string;
		email: string;
	};
}

/**
 * Admin Authorization Middleware
 * Verifies that the authenticated user has admin role
 */
export function adminMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
	const user = req.user;

	if (!user) {
		throw new ForbiddenError('Autenticação necessária');
	}

	if (user.role !== 'admin') {
		throw new ForbiddenError('Acesso restrito a administradores');
	}

	next();
}

/**
 * Role-based Authorization Middleware
 * Verifies that the authenticated user has one of the allowed roles
 */
export function roleMiddleware(allowedRoles: string[]) {
	return (req: AuthRequest, res: Response, next: NextFunction) => {
		const user = req.user;

		if (!user) {
			throw new ForbiddenError('Autenticação necessária');
		}

		if (!allowedRoles.includes(user.role)) {
			throw new ForbiddenError(
				`Acesso restrito a: ${allowedRoles.join(', ')}`
			);
		}

		next();
	};
}