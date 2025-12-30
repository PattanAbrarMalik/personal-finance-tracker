/**
 * Global error codes and messages
 * Consistent error handling across the API
 */
export declare enum ErrorCode {
    INVALID_CREDENTIALS = "AUTH_001",
    TOKEN_EXPIRED = "AUTH_002",
    TOKEN_INVALID = "AUTH_003",
    UNAUTHORIZED = "AUTH_004",
    USER_NOT_FOUND = "AUTH_005",
    USER_ALREADY_EXISTS = "AUTH_006",
    VALIDATION_ERROR = "VAL_001",
    INVALID_EMAIL = "VAL_002",
    INVALID_PASSWORD = "VAL_003",
    MISSING_FIELD = "VAL_004",
    RESOURCE_NOT_FOUND = "RES_001",
    RESOURCE_CONFLICT = "RES_002",
    RESOURCE_DELETED = "RES_003",
    INSUFFICIENT_BALANCE = "BUS_001",
    BUDGET_EXCEEDED = "BUS_002",
    DUPLICATE_ENTRY = "BUS_003",
    INTERNAL_ERROR = "SRV_001",
    DATABASE_ERROR = "SRV_002",
    EXTERNAL_SERVICE_ERROR = "SRV_003"
}
export declare const ErrorMessages: Record<ErrorCode, string>;
//# sourceMappingURL=error-codes.d.ts.map