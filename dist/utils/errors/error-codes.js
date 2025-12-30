"use strict";
/**
 * Global error codes and messages
 * Consistent error handling across the API
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorMessages = exports.ErrorCode = void 0;
var ErrorCode;
(function (ErrorCode) {
    // Authentication (1000-1999)
    ErrorCode["INVALID_CREDENTIALS"] = "AUTH_001";
    ErrorCode["TOKEN_EXPIRED"] = "AUTH_002";
    ErrorCode["TOKEN_INVALID"] = "AUTH_003";
    ErrorCode["UNAUTHORIZED"] = "AUTH_004";
    ErrorCode["USER_NOT_FOUND"] = "AUTH_005";
    ErrorCode["USER_ALREADY_EXISTS"] = "AUTH_006";
    // Validation (2000-2999)
    ErrorCode["VALIDATION_ERROR"] = "VAL_001";
    ErrorCode["INVALID_EMAIL"] = "VAL_002";
    ErrorCode["INVALID_PASSWORD"] = "VAL_003";
    ErrorCode["MISSING_FIELD"] = "VAL_004";
    // Resources (3000-3999)
    ErrorCode["RESOURCE_NOT_FOUND"] = "RES_001";
    ErrorCode["RESOURCE_CONFLICT"] = "RES_002";
    ErrorCode["RESOURCE_DELETED"] = "RES_003";
    // Business Logic (4000-4999)
    ErrorCode["INSUFFICIENT_BALANCE"] = "BUS_001";
    ErrorCode["BUDGET_EXCEEDED"] = "BUS_002";
    ErrorCode["DUPLICATE_ENTRY"] = "BUS_003";
    // Server (5000-5999)
    ErrorCode["INTERNAL_ERROR"] = "SRV_001";
    ErrorCode["DATABASE_ERROR"] = "SRV_002";
    ErrorCode["EXTERNAL_SERVICE_ERROR"] = "SRV_003";
})(ErrorCode || (exports.ErrorCode = ErrorCode = {}));
exports.ErrorMessages = {
    [ErrorCode.INVALID_CREDENTIALS]: 'Invalid email or password',
    [ErrorCode.TOKEN_EXPIRED]: 'Token has expired',
    [ErrorCode.TOKEN_INVALID]: 'Invalid token',
    [ErrorCode.UNAUTHORIZED]: 'Unauthorized access',
    [ErrorCode.USER_NOT_FOUND]: 'User not found',
    [ErrorCode.USER_ALREADY_EXISTS]: 'User already exists',
    [ErrorCode.VALIDATION_ERROR]: 'Validation error',
    [ErrorCode.INVALID_EMAIL]: 'Invalid email format',
    [ErrorCode.INVALID_PASSWORD]: 'Invalid password format',
    [ErrorCode.MISSING_FIELD]: 'Missing required field',
    [ErrorCode.RESOURCE_NOT_FOUND]: 'Resource not found',
    [ErrorCode.RESOURCE_CONFLICT]: 'Resource conflict',
    [ErrorCode.RESOURCE_DELETED]: 'Resource has been deleted',
    [ErrorCode.INSUFFICIENT_BALANCE]: 'Insufficient balance',
    [ErrorCode.BUDGET_EXCEEDED]: 'Budget limit exceeded',
    [ErrorCode.DUPLICATE_ENTRY]: 'Duplicate entry',
    [ErrorCode.INTERNAL_ERROR]: 'Internal server error',
    [ErrorCode.DATABASE_ERROR]: 'Database error',
    [ErrorCode.EXTERNAL_SERVICE_ERROR]: 'External service error',
};
//# sourceMappingURL=error-codes.js.map