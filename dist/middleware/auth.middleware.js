"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.authenticate = void 0;
const jwt_1 = require("../utils/auth/jwt");
const errors_1 = require("../utils/errors");
const errorHandler_middleware_1 = require("./errorHandler.middleware");
/**
 * Middleware to authenticate requests using JWT tokens
 * Adds user information to req.user if token is valid
 */
exports.authenticate = (0, errorHandler_middleware_1.asyncHandler)(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = (0, jwt_1.extractTokenFromHeader)(authHeader);
    if (!token) {
        throw new errors_1.UnauthorizedError('Authentication token required');
    }
    try {
        const payload = (0, jwt_1.verifyToken)(token);
        req.user = {
            userId: payload.userId,
            email: payload.email,
        };
        next();
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Invalid token';
        throw new errors_1.UnauthorizedError(message);
    }
});
/**
 * Optional authentication middleware
 * Adds user information if token is present, but doesn't fail if missing
 */
exports.optionalAuth = (0, errorHandler_middleware_1.asyncHandler)(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = (0, jwt_1.extractTokenFromHeader)(authHeader);
    if (token) {
        try {
            const payload = (0, jwt_1.verifyToken)(token);
            req.user = {
                userId: payload.userId,
                email: payload.email,
            };
        }
        catch (error) {
            // Silently fail for optional auth
        }
    }
    next();
});
//# sourceMappingURL=auth.middleware.js.map