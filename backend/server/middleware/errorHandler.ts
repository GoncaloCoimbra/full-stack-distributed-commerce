import { Request, Response } from 'express';
import { AppError, ValidationError, DatabaseError } from '../utils/errors';
import { logger } from '../config/logger';

export interface ErrorResponse {
	success: false;
	error: {
		message: string;
		code?: string;
		statusCode: number;
		timestamp: string;
		path: string;
		method: string;
		stack?: string;
		requestId?: string;
		errors?: Record<string, string[]>; // For validation errors
	};
}

/**
 * Global Error Handler Middleware
 * Must be registered AFTER all other middleware and routes
 */
export function errorHandler(
	err: Error | AppError,
	req: Request,
	res: Response,
	next: unknown
) {
	void next;
	// Set response header to prevent caching error responses
	res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

	let appError: AppError;

	if (err instanceof AppError) {
		appError = err;
	} else if (err instanceof ValidationError) {
		appError = err;
	} else if (err instanceof DatabaseError) {
		appError = err;
	} else if (err instanceof SyntaxError) {
		appError = new AppError('Invalid request format', 400);
	} else {
		// Unknown error
		appError = new AppError('Internal server error', 500, false);
		logger.error('Unhandled error:', err);
	}

	// Add request context
	appError.path = req.originalUrl;
	appError.method = req.method;

	// Log error based on severity
	const logLevel = appError.statusCode >= 500 ? 'error' : 'warn';
	logger[logLevel as keyof typeof logger]({
		message: appError.message,
		statusCode: appError.statusCode,
		isOperational: appError.isOperational,
		stack: appError.stack,
		path: appError.path,
		method: appError.method,
		requestId: (req as any).id,
	});

	// Build error response
	const errorResponse: ErrorResponse = {
		success: false,
		error: {
			message: appError.message,
			statusCode: appError.statusCode,
			timestamp: new Date().toISOString(),
			path: req.originalUrl,
			method: req.method,
		},
	};

	// Include validation errors if present
	if (appError instanceof ValidationError) {
		errorResponse.error.errors = appError.errors;
	}

	// Add stack trace in development
	if (process.env.NODE_ENV === 'development') {
		errorResponse.error.stack = appError.stack;
	}

	// Send error response
	res.status(appError.statusCode).json(errorResponse);
}