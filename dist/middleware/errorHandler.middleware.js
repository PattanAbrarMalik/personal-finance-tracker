"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.errorHandler = void 0;
const errors_1 = require("../utils/errors");
const logger_1 = require("../utils/logger");
const errorHandler = (err, req, res, _next) => {
    // Log the error
    if (err instanceof errors_1.AppError) {
        // Operational errors (expected errors)
        logger_1.logger.warn('Operational error occurred', err, {
            path: req.path,
            method: req.method,
            statusCode: err.statusCode,
        });
    }
    else {
        // Programming errors (unexpected errors)
        logger_1.logger.error('Unexpected error occurred', err, {
            path: req.path,
            method: req.method,
            body: req.body,
            query: req.query,
        });
    }
    // Handle known AppError instances
    if (err instanceof errors_1.AppError && err.isOperational) {
        const errorResponse = {
            success: false,
            error: {
                message: err.message,
                code: err.code,
                statusCode: err.statusCode,
            },
        };
        // Include validation details if available
        if ('details' in err && err.details && typeof err.details === 'object') {
            errorResponse.error.details = err.details;
        }
        // Include stack trace in development
        if (process.env.NODE_ENV === 'development') {
            errorResponse.error.stack = err.stack;
        }
        res.status(err.statusCode).json(errorResponse);
        return;
    }
    // Handle unknown errors (programming errors, unexpected errors)
    const errorResponse = {
        success: false,
        error: {
            message: process.env.NODE_ENV === 'production'
                ? 'An unexpected error occurred'
                : err.message,
            statusCode: 500,
        },
    };
    // Include stack trace in development
    if (process.env.NODE_ENV === 'development') {
        errorResponse.error.stack = err.stack;
    }
    res.status(500).json(errorResponse);
    return;
};
exports.errorHandler = errorHandler;
// Async error wrapper to catch errors in async route handlers
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
//# sourceMappingURL=errorHandler.middleware.js.map