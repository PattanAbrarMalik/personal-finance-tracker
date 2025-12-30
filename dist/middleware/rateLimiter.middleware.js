"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordResetLimiter = exports.authLimiter = exports.generalLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const config_1 = require("../config/config");
const logger_1 = require("../utils/logger");
/**
 * General API rate limiter
 * Limits requests to 100 per 15 minutes per IP
 */
exports.generalLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    skip: (req) => {
        // Skip rate limiting in development
        return config_1.config.isDevelopment;
    },
    handler: (req, res) => {
        logger_1.logger.warn('Rate limit exceeded', {
            ip: req.ip,
            path: req.path,
            method: req.method,
        });
        res.status(429).json({
            success: false,
            error: {
                message: 'Too many requests. Please try again later.',
                statusCode: 429,
            },
        });
    },
});
/**
 * Strict rate limiter for authentication endpoints
 * Limits requests to 5 per 15 minutes per IP
 */
exports.authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per windowMs
    message: 'Too many login attempts, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true, // Don't count successful requests
    skip: (req) => {
        return config_1.config.isDevelopment;
    },
    handler: (req, res) => {
        logger_1.logger.warn('Auth rate limit exceeded', {
            ip: req.ip,
            endpoint: req.path,
        });
        res.status(429).json({
            success: false,
            error: {
                message: 'Too many authentication attempts. Please try again later.',
                statusCode: 429,
            },
        });
    },
});
/**
 * Password reset rate limiter
 * Limits requests to 3 per hour per IP
 */
exports.passwordResetLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 requests per windowMs
    message: 'Too many password reset attempts, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
        return config_1.config.isDevelopment;
    },
    handler: (req, res) => {
        logger_1.logger.warn('Password reset rate limit exceeded', {
            ip: req.ip,
        });
        res.status(429).json({
            success: false,
            error: {
                message: 'Too many password reset attempts. Please try again later.',
                statusCode: 429,
            },
        });
    },
});
//# sourceMappingURL=rateLimiter.middleware.js.map