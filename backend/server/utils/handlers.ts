import { Request, Response, NextFunction } from 'express';

/**
 * Async Route Handler Wrapper
 * Wraps async route handlers to catch errors and pass to error middleware
 * Usage: router.post('/endpoint', asyncHandler(async (req, res) => { ... }))
 */
export function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
	return (req: Request, res: Response, next: NextFunction) => {
		Promise.resolve(fn(req, res, next)).catch(next);
	};
}

/**
 * Request ID middleware - adds unique ID to each request for tracing
 */
export function requestIdMiddleware(req: Request, res: Response, next: NextFunction) {
	const requestId = req.headers['x-request-id'] as string || 
		`${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
	(req as any).id = requestId;
	res.setHeader('x-request-id', requestId);
	next();
}
