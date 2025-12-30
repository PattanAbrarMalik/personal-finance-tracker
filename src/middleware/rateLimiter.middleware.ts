import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';
import { config } from '../config/config';
import { logger } from '../utils/logger';

/**
 * General API rate limiter
 * Limits requests to 100 per 15 minutes per IP
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skip: (req: Request) => {
    // Skip rate limiting in development
    return config.isDevelopment;
  },
  handler: (req: Request, res: Response) => {
    logger.warn('Rate limit exceeded', {
      ip: req.ip,
      path: req.path,
      method: req.method,
    });
    
    res.status(429).json({
      success: false,
      error: {
        message: 'Too many requests. Please try again later.',
        statusCode: 429,
      },
    });
  },
});

/**
 * Strict rate limiter for authentication endpoints
 * Limits requests to 5 per 15 minutes per IP
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per windowMs
  message: 'Too many login attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
  skip: (req: Request) => {
    return config.isDevelopment;
  },
  handler: (req: Request, res: Response) => {
    logger.warn('Auth rate limit exceeded', {
      ip: req.ip,
      endpoint: req.path,
    });
    
    res.status(429).json({
      success: false,
      error: {
        message: 'Too many authentication attempts. Please try again later.',
        statusCode: 429,
      },
    });
  },
});

/**
 * Password reset rate limiter
 * Limits requests to 3 per hour per IP
 */
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 requests per windowMs
  message: 'Too many password reset attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req: Request) => {
    return config.isDevelopment;
  },
  handler: (req: Request, res: Response) => {
    logger.warn('Password reset rate limit exceeded', {
      ip: req.ip,
    });
    
    res.status(429).json({
      success: false,
      error: {
        message: 'Too many password reset attempts. Please try again later.',
        statusCode: 429,
      },
    });
  },
});
