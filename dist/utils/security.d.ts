/**
 * Security utilities - encryption, hashing, tokens
 */
export declare class SecurityUtils {
    /**
     * Generate random string
     */
    static generateRandomString(length?: number): string;
    /**
     * Generate UUID v4
     */
    static generateUUID(): string;
    /**
     * Hash with SHA256
     */
    static hash(data: string, salt?: string): string;
    /**
     * Generate HMAC signature
     */
    static generateHMAC(data: string, secret: string): string;
    /**
     * Encrypt data (AES-256)
     */
    static encrypt(data: string, secret: string): string;
    /**
     * Decrypt data
     */
    static decrypt(encrypted: string, secret: string): string;
    /**
     * Constant time comparison (prevent timing attacks)
     */
    static constantTimeCompare(a: string, b: string): boolean;
    /**
     * Generate secure token
     */
    static generateSecureToken(): string;
    /**
     * Verify token hasn't been tampered with
     */
    static verifyTokenSignature(token: string, signature: string, secret: string): boolean;
}
/**
 * Rate limiting utilities
 */
export declare class RateLimiter {
    private maxAttempts;
    private windowMs;
    private attempts;
    constructor(maxAttempts?: number, windowMs?: number);
    isAllowed(key: string): boolean;
    getRemainingAttempts(key: string): number;
    reset(key: string): void;
    clear(): void;
}
/**
 * CORS utilities
 */
export declare class CORSUtils {
    static isOriginAllowed(origin: string, allowedOrigins: string[]): boolean;
    static generateCORSHeaders(origin: string, allowedOrigins: string[]): {
        'Access-Control-Allow-Origin': string;
        'Access-Control-Allow-Methods': string;
        'Access-Control-Allow-Headers': string;
        'Access-Control-Max-Age': string;
        'Access-Control-Allow-Credentials': string;
    };
}
/**
 * Input validation and sanitization
 */
export declare class InputSanitizer {
    /**
     * Remove HTML tags
     */
    static stripHtml(input: string): string;
    /**
     * Escape HTML entities
     */
    static escapeHtml(input: string): string;
    /**
     * Sanitize email
     */
    static sanitizeEmail(email: string): string;
    /**
     * Sanitize URL
     */
    static sanitizeUrl(url: string): string;
    /**
     * Prevent SQL injection-like patterns
     */
    static containsSuspiciousPatterns(input: string): boolean;
}
//# sourceMappingURL=security.d.ts.map