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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const Sentry = __importStar(require("@sentry/node"));
const health_routes_1 = require("./routes/health.routes");
const example_routes_1 = require("./routes/example.routes");
const auth_routes_1 = require("./routes/auth.routes");
const category_routes_1 = require("./routes/category.routes");
const transaction_routes_1 = require("./routes/transaction.routes");
const budget_routes_1 = require("./routes/budget.routes");
const savingsGoal_routes_1 = __importDefault(require("./routes/savingsGoal.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const twoFactor_routes_1 = __importDefault(require("./routes/twoFactor.routes"));
const config_1 = require("./config/config");
const swagger_1 = require("./config/swagger");
const errorHandler_middleware_1 = require("./middleware/errorHandler.middleware");
const notFoundHandler_middleware_1 = require("./middleware/notFoundHandler.middleware");
const rateLimiter_middleware_1 = require("./middleware/rateLimiter.middleware");
const logger_1 = require("./utils/logger");
const sentry_1 = require("./config/sentry");
// Load environment variables
dotenv_1.default.config();
// Initialize Sentry error tracking
(0, sentry_1.initSentry)();
if (config_1.config.sentryDsn) {
    Sentry.init({
        dsn: config_1.config.sentryDsn,
        environment: config_1.config.sentryEnvironment,
        tracesSampleRate: config_1.config.sentryTracesSampleRate,
    });
}
const app = (0, express_1.default)();
const port = config_1.config.port;
// Sentry request handler (must be early)
if (config_1.config.sentryDsn) {
    app.use(Sentry.Handlers.requestHandler());
    app.use(Sentry.Handlers.tracingHandler());
}
// Middleware - Logging (should be early)
app.use((0, morgan_1.default)(config_1.config.isDevelopment ? 'dev' : 'combined', {
    stream: {
        write: (message) => {
            logger_1.logger.info(message.trim());
        },
    },
    skip: (req) => req.path === '/api/health', // Skip health check logs
}));
// Middleware - Security
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", 'data:', 'https:'],
        },
    },
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
    noSniff: true,
    xssFilter: true,
}));
app.use((0, cors_1.default)({
    origin: config_1.config.corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400,
}));
// Middleware - Rate limiting (general)
app.use('/api/', rateLimiter_middleware_1.generalLimiter);
// Middleware - Body parsing
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// API Documentation
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Finance Tracker API Documentation',
}));
// Routes
app.use('/api/health', health_routes_1.healthRouter);
app.use('/api/auth', auth_routes_1.authRouter);
app.use('/api/users', user_routes_1.default);
app.use('/api/2fa', twoFactor_routes_1.default);
app.use('/api/categories', category_routes_1.categoryRouter);
app.use('/api/transactions', transaction_routes_1.transactionRouter);
app.use('/api/budgets', budget_routes_1.budgetRouter);
app.use('/api/savings-goals', savingsGoal_routes_1.default);
app.use('/api/example', example_routes_1.exampleRouter);
// 404 handler (must be after all routes)
app.use(notFoundHandler_middleware_1.notFoundHandler);
// Sentry error handler (must be before custom error handler)
if (config_1.config.sentryDsn) {
    app.use(Sentry.Handlers.errorHandler());
}
// Error handling middleware (must be last)
app.use(errorHandler_middleware_1.errorHandler);
// Start server
try {
    app.listen(port, () => {
        logger_1.logger.info('Server started successfully', {
            port,
            environment: config_1.config.nodeEnv,
            url: `http://localhost:${port}`,
            apiDocs: `http://localhost:${port}/api-docs`,
        });
    });
}
catch (error) {
    logger_1.logger.error('Failed to start server', error instanceof Error ? error : new Error(String(error)));
    process.exit(1);
}
// Global error handlers
process.on('uncaughtException', (error) => {
    logger_1.logger.error('Uncaught exception', error);
    process.exit(1);
});
process.on('unhandledRejection', (reason) => {
    logger_1.logger.error('Unhandled rejection', reason instanceof Error ? reason : new Error(String(reason)));
    process.exit(1);
});
exports.default = app;
//# sourceMappingURL=index.js.map