export interface JWTPayload {
    userId: string;
    email: string;
}
/**
 * Generate a JWT token for a user
 */
export declare const generateToken: (payload: JWTPayload) => string;
/**
 * Verify and decode a JWT token
 */
export declare const verifyToken: (token: string) => JWTPayload;
/**
 * Extract token from Authorization header
 */
export declare const extractTokenFromHeader: (authHeader: string | undefined) => string | null;
//# sourceMappingURL=jwt.d.ts.map