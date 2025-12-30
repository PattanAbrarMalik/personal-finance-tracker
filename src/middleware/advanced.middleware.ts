/**
 * Advanced middleware implementations
 */

import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

/**
 * Request ID middleware
 */
export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const requestId = req.headers['x-request-id'] as string || generateId();
  res.setHeader('X-Request-ID', requestId);
  (req as any).id = requestId;
  next();
};

/**
 * Performance monitoring middleware
 */
export const performanceMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const slow = duration > 1000;
    
    if (slow) {
      logger.warn(`Slow request detected`, {
        method: req.method,
        path: req.path,
        status: res.statusCode,
        duration,
        requestId: (req as any).id,
      });
    }
  });
  
  next();
};

/**
 * Compression headers middleware
 */
export const compressionHeadersMiddleware = (req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Content-Encoding', 'gzip');
  res.setHeader('Vary', 'Accept-Encoding');
  next();
};

/**
 * API versioning middleware
 */
export const versioningMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const version = req.headers['api-version'] as string || '1.0';
  (req as any).apiVersion = version;
  next();
};

/**
 * Request sanitization middleware
 */
export const sanitizationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.body) {
    sanitizeObject(req.body);
  }
  next();
};

function sanitizeObject(obj: any) {
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      obj[key] = obj[key]
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .trim();
    } else if (typeof obj[key] === 'object') {
      sanitizeObject(obj[key]);
    }
  }
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
