"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sentry = exports.clearUserContext = exports.setUserContext = exports.captureMessage = exports.captureException = exports.initSentry = void 0;
const Sentry = __importStar(require("@sentry/node"));
exports.Sentry = Sentry;
const config_1 = require("./config");
/**
 * Initialize Sentry error tracking
 */
const initSentry = () => {
    if (!config_1.config.sentryDsn) {
        console.log('Sentry DSN not configured, skipping initialization');
        return;
    }
    Sentry.init({
        dsn: config_1.config.sentryDsn,
        environment: config_1.config.sentryEnvironment,
        tracesSampleRate: config_1.config.sentryTracesSampleRate,
        integrations: [
            new Sentry.Integrations.Http({ tracing: true }),
            new Sentry.Integrations.OnUncaughtException(),
            new Sentry.Integrations.OnUnhandledRejection(),
        ],
        maxBreadcrumbs: 50,
        attachStacktrace: true,
        debug: config_1.config.isDevelopment,
    });
    console.log('✓ Sentry initialized');
};
exports.initSentry = initSentry;
/**
 * Capture exception with context
 */
const captureException = (error, context) => {
    Sentry.captureException(error);
    if (context) {
        Sentry.setContext('error_context', context);
    }
};
exports.captureException = captureException;
/**
 * Capture message
 */
const captureMessage = (message, level = 'info') => {
    Sentry.captureMessage(message, level);
};
exports.captureMessage = captureMessage;
/**
 * Set user context
 */
const setUserContext = (userId, email, name) => {
    Sentry.setUser({
        id: userId,
        email,
        username: name,
    });
};
exports.setUserContext = setUserContext;
/**
 * Clear user context
 */
const clearUserContext = () => {
    Sentry.setUser(null);
};
exports.clearUserContext = clearUserContext;
//# sourceMappingURL=sentry.js.map