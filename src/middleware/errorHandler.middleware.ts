import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { logger } from '../utils/logger';

interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
    statusCode: number;
    details?: Record<string, string[]>;
    stack?: string;
  };
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Log the error
  if (err instanceof AppError) {
    // Operational errors (expected errors)
    logger.warn('Operational error occurred', err, {
      path: req.path,
      method: req.method,
      statusCode: err.statusCode,
    });
  } else {
    // Programming errors (unexpected errors)
    logger.error('Unexpected error occurred', err, {
      path: req.path,
      method: req.method,
      body: req.body,
      query: req.query,
    });
  }

  // Handle known AppError instances
  if (err instanceof AppError && err.isOperational) {
    const errorResponse: ErrorResponse = {
      success: false,
      error: {
        message: err.message,
        code: err.code,
        statusCode: err.statusCode,
      },
    };

    // Include validation details if available
    if ('details' in err && err.details && typeof err.details === 'object') {
      errorResponse.error.details = err.details as Record<string, string[]>;
    }

    // Include stack trace in development
    if (process.env.NODE_ENV === 'development') {
      errorResponse.error.stack = err.stack;
    }

    res.status(err.statusCode).json(errorResponse);
    return;
  }

  // Handle unknown errors (programming errors, unexpected errors)
  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      message: process.env.NODE_ENV === 'production' 
        ? 'An unexpected error occurred' 
        : err.message,
      statusCode: 500,
    },
  };

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.error.stack = err.stack;
  }

  res.status(500).json(errorResponse);
  return;
};

// Async error wrapper to catch errors in async route handlers
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void | Response>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

