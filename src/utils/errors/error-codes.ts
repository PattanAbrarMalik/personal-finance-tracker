/**
 * Global error codes and messages
 * Consistent error handling across the API
 */

export enum ErrorCode {
  // Authentication (1000-1999)
  INVALID_CREDENTIALS = 'AUTH_001',
  TOKEN_EXPIRED = 'AUTH_002',
  TOKEN_INVALID = 'AUTH_003',
  UNAUTHORIZED = 'AUTH_004',
  USER_NOT_FOUND = 'AUTH_005',
  USER_ALREADY_EXISTS = 'AUTH_006',

  // Validation (2000-2999)
  VALIDATION_ERROR = 'VAL_001',
  INVALID_EMAIL = 'VAL_002',
  INVALID_PASSWORD = 'VAL_003',
  MISSING_FIELD = 'VAL_004',

  // Resources (3000-3999)
  RESOURCE_NOT_FOUND = 'RES_001',
  RESOURCE_CONFLICT = 'RES_002',
  RESOURCE_DELETED = 'RES_003',

  // Business Logic (4000-4999)
  INSUFFICIENT_BALANCE = 'BUS_001',
  BUDGET_EXCEEDED = 'BUS_002',
  DUPLICATE_ENTRY = 'BUS_003',

  // Server (5000-5999)
  INTERNAL_ERROR = 'SRV_001',
  DATABASE_ERROR = 'SRV_002',
  EXTERNAL_SERVICE_ERROR = 'SRV_003',
}

export const ErrorMessages: Record<ErrorCode, string> = {
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
