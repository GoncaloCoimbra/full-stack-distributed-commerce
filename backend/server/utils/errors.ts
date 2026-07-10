/**
 * Application Error Classes
 * Structured error handling for consistent error responses
 */

export class AppError extends Error {
	public readonly statusCode: number;
	public readonly isOperational: boolean;
	public readonly timestamp: Date;
	public path?: string;
	public method?: string;

	constructor(
		message: string,
		statusCode: number = 500,
		isOperational: boolean = true
	) {
		super(message);
		Object.setPrototypeOf(this, AppError.prototype);

		this.statusCode = statusCode;
		this.isOperational = isOperational;
		this.timestamp = new Date();

		Error.captureStackTrace(this, this.constructor);
	}
}

export class BadRequestError extends AppError {
	constructor(message: string = 'Bad Request') {
		super(message, 400, true);
		Object.setPrototypeOf(this, BadRequestError.prototype);
	}
}

export class UnauthorizedError extends AppError {
	constructor(message: string = 'Unauthorized') {
		super(message, 401, true);
		Object.setPrototypeOf(this, UnauthorizedError.prototype);
	}
}

export class ForbiddenError extends AppError {
	constructor(message: string = 'Forbidden') {
		super(message, 403, true);
		Object.setPrototypeOf(this, ForbiddenError.prototype);
	}
}

export class NotFoundError extends AppError {
	constructor(resource: string = 'Resource') {
		super(`${resource} not found`, 404, true);
		Object.setPrototypeOf(this, NotFoundError.prototype);
	}
}

export class ConflictError extends AppError {
	constructor(message: string = 'Conflict') {
		super(message, 409, true);
		Object.setPrototypeOf(this, ConflictError.prototype);
	}
}

export class ValidationError extends AppError {
	public readonly errors: Record<string, string[]>;

	constructor(message: string, errors: Record<string, string[]> = {}) {
		super(message, 422, true);
		this.errors = errors;
		Object.setPrototypeOf(this, ValidationError.prototype);
	}
}

export class InternalServerError extends AppError {
	constructor(message: string = 'Internal server error') {
		super(message, 500, true);
		Object.setPrototypeOf(this, InternalServerError.prototype);
	}
}

export class ServiceError extends AppError {
	constructor(
		service: string,
		message: string,
		statusCode: number = 500
	) {
		super(`${service} service error: ${message}`, statusCode, true);
		Object.setPrototypeOf(this, ServiceError.prototype);
	}
}

export class EmailServiceError extends ServiceError {
	constructor(message: string) {
		super('Email', message, 500);
		Object.setPrototypeOf(this, EmailServiceError.prototype);
	}
}

export class DatabaseError extends AppError {
	constructor(message: string = 'Database error') {
		super(message, 500, false);
		Object.setPrototypeOf(this, DatabaseError.prototype);
	}
}
