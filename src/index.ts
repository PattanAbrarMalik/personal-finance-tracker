import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import * as Sentry from '@sentry/node';
import { healthRouter } from './routes/health.routes';
import { exampleRouter } from './routes/example.routes';
import { authRouter } from './routes/auth.routes';
import { categoryRouter } from './routes/category.routes';
import { transactionRouter } from './routes/transaction.routes';
import { budgetRouter } from './routes/budget.routes';
import savingsGoalRouter from './routes/savingsGoal.routes';
import userRouter from './routes/user.routes';
import twoFactorRouter from './routes/twoFactor.routes';
import { config } from './config/config';
import { swaggerSpec } from './config/swagger';
import { errorHandler } from './middleware/errorHandler.middleware';
import { notFoundHandler } from './middleware/notFoundHandler.middleware';
import { generalLimiter, authLimiter } from './middleware/rateLimiter.middleware';
import { logger } from './utils/logger';
import { initSentry } from './config/sentry';

// Load environment variables
dotenv.config();

// Initialize Sentry error tracking
initSentry();
if (config.sentryDsn) {
  Sentry.init({
    dsn: config.sentryDsn,
    environment: config.sentryEnvironment,
    tracesSampleRate: config.sentryTracesSampleRate,
  });
}

const app: Express = express();
const port = config.port;

// Sentry request handler (must be early)
if (config.sentryDsn) {
  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());
}

// Middleware - Logging (should be early)
app.use(morgan(config.isDevelopment ? 'dev' : 'combined', {
  stream: {
    write: (message: string) => {
      logger.info(message.trim());
    },
  },
  skip: (req) => req.path === '/api/health', // Skip health check logs
}));

// Middleware - Security
app.use(helmet({
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

app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400,
}));

// Health check route (BEFORE rate limiting so Railway can check it)
app.use('/api/health', healthRouter);

// Middleware - Rate limiting (general) - Applied AFTER health check
app.use('/api/', generalLimiter);

// Middleware - Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Finance Tracker API Documentation',
}));

// Routes (health already registered above)
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/2fa', twoFactorRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/transactions', transactionRouter);
app.use('/api/budgets', budgetRouter);
app.use('/api/savings-goals', savingsGoalRouter);
app.use('/api/example', exampleRouter);

// 404 handler (must be after all routes)
app.use(notFoundHandler);

// Sentry error handler (must be before custom error handler)
if (config.sentryDsn) {
  app.use(Sentry.Handlers.errorHandler());
}

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
try {
  app.listen(port, '0.0.0.0', () => {
    logger.info('Server started successfully', {
      port,
      environment: config.nodeEnv,
      url: `http://localhost:${port}`,
      apiDocs: `http://localhost:${port}/api-docs`,
    });
  });
} catch (error) {
  logger.error('Failed to start server', error instanceof Error ? error : new Error(String(error)));
  process.exit(1);
}

// Global error handlers
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled rejection', reason instanceof Error ? reason : new Error(String(reason)));
  process.exit(1);
});

export default app;

