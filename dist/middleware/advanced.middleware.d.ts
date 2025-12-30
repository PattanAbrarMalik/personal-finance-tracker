/**
 * Advanced middleware implementations
 */
import { Request, Response, NextFunction } from 'express';
/**
 * Request ID middleware
 */
export declare const requestIdMiddleware: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Performance monitoring middleware
 */
export declare const performanceMiddleware: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Compression headers middleware
 */
export declare const compressionHeadersMiddleware: (req: Request, res: Response, next: NextFunction) => void;
/**
 * API versioning middleware
 */
export declare const versioningMiddleware: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Request sanitization middleware
 */
export declare const sanitizationMiddleware: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=advanced.middleware.d.ts.map