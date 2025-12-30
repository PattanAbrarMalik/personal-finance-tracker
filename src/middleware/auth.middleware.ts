import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractTokenFromHeader } from '../utils/auth/jwt';
import { UnauthorizedError } from '../utils/errors';
import { asyncHandler } from './errorHandler.middleware';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
      };
    }
  }
}

/**
 * Middleware to authenticate requests using JWT tokens
 * Adds user information to req.user if token is valid
 */
export const authenticate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      throw new UnauthorizedError('Authentication token required');
    }

    try {
      const payload = verifyToken(token);
      req.user = {
        userId: payload.userId,
        email: payload.email,
      };
      next();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Invalid token';
      throw new UnauthorizedError(message);
    }
  }
);

/**
 * Optional authentication middleware
 * Adds user information if token is present, but doesn't fail if missing
 */
export const optionalAuth = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (token) {
      try {
        const payload = verifyToken(token);
        req.user = {
          userId: payload.userId,
          email: payload.email,
        };
      } catch (error) {
        // Silently fail for optional auth
      }
    }

    next();
  }
);








