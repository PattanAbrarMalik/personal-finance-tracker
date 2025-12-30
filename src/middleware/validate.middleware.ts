import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ValidationError } from '../utils/errors';
import { asyncHandler } from './errorHandler.middleware';

interface ValidationTargets {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

/**
 * Validates request body, query, or params using Zod schemas
 * @param schemas - Object containing Zod schemas for body, query, and/or params
 * @returns Express middleware function
 */
export const validate = (schemas: ValidationTargets) => {
  return asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const errors: Record<string, string[]> = {};

    // Validate body
    if (schemas.body) {
      try {
        req.body = await schemas.body.parseAsync(req.body);
      } catch (error) {
        if (error instanceof ZodError) {
          error.errors.forEach((err) => {
            const path = err.path.join('.');
            if (!errors[path]) {
              errors[path] = [];
            }
            errors[path].push(err.message);
          });
        }
      }
    }

    // Validate query
    if (schemas.query) {
      try {
        req.query = await schemas.query.parseAsync(req.query);
      } catch (error) {
        if (error instanceof ZodError) {
          error.errors.forEach((err) => {
            const path = `query.${err.path.join('.')}`;
            if (!errors[path]) {
              errors[path] = [];
            }
            errors[path].push(err.message);
          });
        }
      }
    }

    // Validate params
    if (schemas.params) {
      try {
        req.params = await schemas.params.parseAsync(req.params);
      } catch (error) {
        if (error instanceof ZodError) {
          error.errors.forEach((err) => {
            const path = `params.${err.path.join('.')}`;
            if (!errors[path]) {
              errors[path] = [];
            }
            errors[path].push(err.message);
          });
        }
      }
    }

    // If there are validation errors, throw ValidationError
    if (Object.keys(errors).length > 0) {
      throw new ValidationError('Validation failed', errors);
    }

    next();
  });
};

