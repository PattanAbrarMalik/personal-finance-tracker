import * as Sentry from '@sentry/node';
import { config } from './config';

/**
 * Initialize Sentry error tracking
 */
export const initSentry = () => {
  if (!config.sentryDsn) {
    console.log('Sentry DSN not configured, skipping initialization');
    return;
  }

  Sentry.init({
    dsn: config.sentryDsn,
    environment: config.sentryEnvironment,
    tracesSampleRate: config.sentryTracesSampleRate,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Sentry.Integrations.OnUncaughtException(),
      new Sentry.Integrations.OnUnhandledRejection(),
    ],
    maxBreadcrumbs: 50,
    attachStacktrace: true,
    debug: config.isDevelopment,
  });

  console.log('✓ Sentry initialized');
};

/**
 * Capture exception with context
 */
export const captureException = (error: Error, context?: Record<string, any>) => {
  Sentry.captureException(error);
  if (context) {
    Sentry.setContext('error_context', context);
  }
};

/**
 * Capture message
 */
export const captureMessage = (message: string, level: 'fatal' | 'error' | 'warning' | 'info' = 'info') => {
  Sentry.captureMessage(message, level);
};

/**
 * Set user context
 */
export const setUserContext = (userId: string, email?: string, name?: string) => {
  Sentry.setUser({
    id: userId,
    email,
    username: name,
  });
};

/**
 * Clear user context
 */
export const clearUserContext = () => {
  Sentry.setUser(null);
};

/**
 * Get Sentry instance
 */
export { Sentry };
