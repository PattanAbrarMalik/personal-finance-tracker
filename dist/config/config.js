"use strict";
/**
 * Application configuration
 * Environment variables should be set in .env file
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const getEnvVariable = (key, defaultValue) => {
    const value = process.env[key];
    if (!value && !defaultValue) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value || defaultValue || '';
};
exports.config = {
    // Server
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: (process.env.NODE_ENV || 'development'),
    appUrl: process.env.APP_URL || 'http://localhost:3000',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    // CORS
    corsOrigin: process.env.CORS_ORIGIN
        ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
        : ['http://localhost:5173', 'http://localhost:5174'],
    // Database
    databaseUrl: getEnvVariable('DATABASE_URL', process.env.NODE_ENV === 'production'
        ? undefined
        : 'postgresql://localhost:5432/coindex' // PostgreSQL for consistency
    ),
    // JWT
    jwtSecret: process.env.NODE_ENV === 'production'
        ? getEnvVariable('JWT_SECRET') // Required in production
        : process.env.JWT_SECRET || 'dev-secret-key-change-in-production',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    // OAuth (if applicable)
    googleOAuthClientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
    googleOAuthClientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    // Error Tracking (Sentry)
    sentryDsn: process.env.SENTRY_DSN,
    sentryEnvironment: process.env.SENTRY_ENVIRONMENT || 'development',
    sentryTracesSampleRate: parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE || '1.0'),
    // Rate Limiting
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '15000', 10),
    rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
    // Logging
    logLevel: process.env.LOG_LEVEL || 'info',
    // Validation
    isProduction: process.env.NODE_ENV === 'production',
    isDevelopment: process.env.NODE_ENV === 'development',
};
// Validate critical config in production
if (exports.config.isProduction) {
    const requiredInProduction = ['JWT_SECRET', 'DATABASE_URL'];
    const missing = requiredInProduction.filter(key => !process.env[key]);
    if (missing.length > 0) {
        throw new Error(`Missing required production environment variables: ${missing.join(', ')}`);
    }
}
//# sourceMappingURL=config.js.map