"use strict";
/**
 * Advanced middleware implementations
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizationMiddleware = exports.versioningMiddleware = exports.compressionHeadersMiddleware = exports.performanceMiddleware = exports.requestIdMiddleware = void 0;
const logger_1 = require("../utils/logger");
/**
 * Request ID middleware
 */
const requestIdMiddleware = (req, res, next) => {
    const requestId = req.headers['x-request-id'] || generateId();
    res.setHeader('X-Request-ID', requestId);
    req.id = requestId;
    next();
};
exports.requestIdMiddleware = requestIdMiddleware;
/**
 * Performance monitoring middleware
 */
const performanceMiddleware = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        const slow = duration > 1000;
        if (slow) {
            logger_1.logger.warn(`Slow request detected`, {
                method: req.method,
                path: req.path,
                status: res.statusCode,
                duration,
                requestId: req.id,
            });
        }
    });
    next();
};
exports.performanceMiddleware = performanceMiddleware;
/**
 * Compression headers middleware
 */
const compressionHeadersMiddleware = (req, res, next) => {
    res.setHeader('Content-Encoding', 'gzip');
    res.setHeader('Vary', 'Accept-Encoding');
    next();
};
exports.compressionHeadersMiddleware = compressionHeadersMiddleware;
/**
 * API versioning middleware
 */
const versioningMiddleware = (req, res, next) => {
    const version = req.headers['api-version'] || '1.0';
    req.apiVersion = version;
    next();
};
exports.versioningMiddleware = versioningMiddleware;
/**
 * Request sanitization middleware
 */
const sanitizationMiddleware = (req, res, next) => {
    if (req.body) {
        sanitizeObject(req.body);
    }
    next();
};
exports.sanitizationMiddleware = sanitizationMiddleware;
function sanitizeObject(obj) {
    for (const key in obj) {
        if (typeof obj[key] === 'string') {
            obj[key] = obj[key]
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .trim();
        }
        else if (typeof obj[key] === 'object') {
            sanitizeObject(obj[key]);
        }
    }
}
function generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
//# sourceMappingURL=advanced.middleware.js.map