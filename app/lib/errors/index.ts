import { ErrorStatusCode } from '@/app/lib/types/http';

export class AppError extends Error {
  public readonly statusCode: ErrorStatusCode;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: ErrorStatusCode = 500, isOperational: boolean = true) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  public readonly details?: Record<string, unknown>;

  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 400);
    this.name = 'ValidationError';
    this.details = details;
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, public readonly originalError?: unknown) {
    super(message, 500);
    this.name = 'DatabaseError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string | number) {
    const message = id ? `${resource} with id ${id} not found` : `${resource} not found`;
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409);
    this.name = 'ConflictError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 403);
    this.name = 'ForbiddenError';
  }
}
