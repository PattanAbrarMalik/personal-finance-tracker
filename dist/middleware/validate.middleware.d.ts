import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
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
export declare const validate: (schemas: ValidationTargets) => (req: Request, res: Response, next: NextFunction) => void;
export {};
//# sourceMappingURL=validate.middleware.d.ts.map