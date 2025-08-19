import { Context } from 'hono';
import { AppError, ValidationError } from '@/app/lib/errors';
import { ErrorStatusCode } from '@/app/lib/types/http';

/**
 * Middleware для обработки ошибок в Hono
 */
export function errorHandler(err: Error, c: Context) {
  console.error('Error occurred:', err);

  if (err instanceof AppError) {
    const errorResponse = {
      error: err.constructor.name,
      message: err.message,
      statusCode: err.statusCode,
      timestamp: new Date().toISOString(),
    };

    if (err instanceof ValidationError && err.details) {
      return c.json({ ...errorResponse, details: err.details }, err.statusCode as ErrorStatusCode);
    }

    return c.json(errorResponse, err.statusCode as ErrorStatusCode);
  }

  // Неизвестная ошибка
  return c.json({
    error: 'InternalServerError',
    message: 'An unexpected error occurred',
    statusCode: 500,
    timestamp: new Date().toISOString(),
  }, 500);
}

/**
 * Wrapper для async функций с обработкой ошибок
 */
export function withErrorHandling<T extends unknown[], R>(
  handler: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    try {
      return await handler(...args);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Internal server error', 500);
    }
  };
}
