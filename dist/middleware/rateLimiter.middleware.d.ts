/**
 * General API rate limiter
 * Limits requests to 100 per 15 minutes per IP
 */
export declare const generalLimiter: import("express-rate-limit").RateLimitRequestHandler;
/**
 * Strict rate limiter for authentication endpoints
 * Limits requests to 5 per 15 minutes per IP
 */
export declare const authLimiter: import("express-rate-limit").RateLimitRequestHandler;
/**
 * Password reset rate limiter
 * Limits requests to 3 per hour per IP
 */
export declare const passwordResetLimiter: import("express-rate-limit").RateLimitRequestHandler;
//# sourceMappingURL=rateLimiter.middleware.d.ts.map