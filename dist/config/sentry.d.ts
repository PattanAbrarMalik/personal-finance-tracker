import * as Sentry from '@sentry/node';
/**
 * Initialize Sentry error tracking
 */
export declare const initSentry: () => void;
/**
 * Capture exception with context
 */
export declare const captureException: (error: Error, context?: Record<string, any>) => void;
/**
 * Capture message
 */
export declare const captureMessage: (message: string, level?: "fatal" | "error" | "warning" | "info") => void;
/**
 * Set user context
 */
export declare const setUserContext: (userId: string, email?: string, name?: string) => void;
/**
 * Clear user context
 */
export declare const clearUserContext: () => void;
/**
 * Get Sentry instance
 */
export { Sentry };
//# sourceMappingURL=sentry.d.ts.map