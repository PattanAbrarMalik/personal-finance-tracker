"use strict";
/**
 * Response formatting utilities
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseFormatter = void 0;
exports.responseFormatter = {
    /**
     * Success response
     */
    success: (data, meta) => ({
        success: true,
        data,
        meta: {
            timestamp: new Date().toISOString(),
            version: '1.0',
            ...meta,
        },
    }),
    /**
     * Paginated success response
     */
    paginated: (data, total, page, limit) => ({
        success: true,
        data,
        pagination: {
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
        },
        meta: {
            timestamp: new Date().toISOString(),
            version: '1.0',
        },
    }),
    /**
     * Error response
     */
    error: (code, message, details) => ({
        success: false,
        error: {
            code,
            message,
            details,
        },
        meta: {
            timestamp: new Date().toISOString(),
            version: '1.0',
        },
    }),
    /**
     * Created response (201)
     */
    created: (data) => ({
        success: true,
        data,
        meta: {
            timestamp: new Date().toISOString(),
            version: '1.0',
        },
    }),
    /**
     * Deleted response
     */
    deleted: (id) => ({
        success: true,
        data: { id, deleted: true },
        meta: {
            timestamp: new Date().toISOString(),
            version: '1.0',
        },
    }),
};
//# sourceMappingURL=response-formatter.js.map