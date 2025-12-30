import { Request, Response, NextFunction } from 'express';
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
export declare const authenticate: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Optional authentication middleware
 * Adds user information if token is present, but doesn't fail if missing
 */
export declare const optionalAuth: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.middleware.d.ts.map