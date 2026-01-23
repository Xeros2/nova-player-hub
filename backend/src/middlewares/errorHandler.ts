/**
 * Nova Player - Error Handler Middleware
 * Centralized error handling
 */

import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import { HTTP_STATUS, ERROR_MESSAGES } from '../utils/constants';
import { env } from '../config/env';

/**
 * Custom API Error class
 */
export class ApiError extends Error {
  public statusCode: number;
  public details?: unknown;
  public isOperational: boolean;

  constructor(message: string, statusCode: number, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string, details?: unknown): ApiError {
    return new ApiError(message, HTTP_STATUS.BAD_REQUEST, details);
  }

  static unauthorized(message = ERROR_MESSAGES.INVALID_CREDENTIALS): ApiError {
    return new ApiError(message, HTTP_STATUS.UNAUTHORIZED);
  }

  static forbidden(message = ERROR_MESSAGES.ACCESS_DENIED): ApiError {
    return new ApiError(message, HTTP_STATUS.FORBIDDEN);
  }

  static notFound(message: string): ApiError {
    return new ApiError(message, HTTP_STATUS.NOT_FOUND);
  }

  static conflict(message: string): ApiError {
    return new ApiError(message, HTTP_STATUS.CONFLICT);
  }

  static tooManyRequests(message = ERROR_MESSAGES.RATE_LIMIT_EXCEEDED): ApiError {
    return new ApiError(message, HTTP_STATUS.TOO_MANY_REQUESTS);
  }

  static internal(message = ERROR_MESSAGES.INTERNAL_ERROR): ApiError {
    return new ApiError(message, HTTP_STATUS.INTERNAL_ERROR);
  }
}

/**
 * Not Found handler
 */
export function notFoundHandler(req: Request, res: Response): void {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`,
    },
  });
}

/**
 * Global error handler
 */
export function errorHandler(
  err: Error | ApiError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  // Default error values
  let statusCode = HTTP_STATUS.INTERNAL_ERROR;
  let message = ERROR_MESSAGES.INTERNAL_ERROR;
  let details: unknown = undefined;

  // Handle known API errors
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    details = err.details;
  }
  // Handle Prisma errors
  else if (err.name === 'PrismaClientKnownRequestError') {
    const prismaError = err as { code?: string; meta?: { target?: string[] } };
    
    if (prismaError.code === 'P2002') {
      statusCode = HTTP_STATUS.CONFLICT;
      message = `Duplicate entry for ${prismaError.meta?.target?.join(', ') || 'field'}`;
    } else if (prismaError.code === 'P2025') {
      statusCode = HTTP_STATUS.NOT_FOUND;
      message = 'Record not found';
    } else {
      statusCode = HTTP_STATUS.BAD_REQUEST;
      message = 'Database operation failed';
    }
  }
  // Handle validation errors (Joi)
  else if (err.name === 'ValidationError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = ERROR_MESSAGES.VALIDATION_ERROR;
    details = (err as { details?: unknown }).details;
  }
  // Handle JWT errors
  else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = HTTP_STATUS.UNAUTHORIZED;
    message = ERROR_MESSAGES.INVALID_TOKEN;
  }

  // Log error
  logger.error(err.message, {
    statusCode,
    path: req.path,
    method: req.method,
    stack: err.stack,
  });

  // Send response
  res.status(statusCode).json({
    success: false,
    error: {
      code: statusCode,
      message,
      ...(env.NODE_ENV === 'development' && {
        details,
        stack: err.stack,
      }),
    },
  });
}

/**
 * Async handler wrapper
 * Wraps async route handlers to catch errors
 */
export function asyncHandler<T>(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<T>
): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export default {
  ApiError,
  notFoundHandler,
  errorHandler,
  asyncHandler,
};
