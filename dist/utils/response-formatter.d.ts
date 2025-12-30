/**
 * Response formatting utilities
 */
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
        details?: any;
    };
    meta?: {
        timestamp: string;
        version: string;
    };
}
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    pagination?: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
}
export declare const responseFormatter: {
    /**
     * Success response
     */
    success: <T>(data: T, meta?: any) => ApiResponse<T>;
    /**
     * Paginated success response
     */
    paginated: <T>(data: T[], total: number, page: number, limit: number) => PaginatedResponse<T>;
    /**
     * Error response
     */
    error: (code: string, message: string, details?: any) => ApiResponse;
    /**
     * Created response (201)
     */
    created: <T>(data: T) => ApiResponse<T>;
    /**
     * Deleted response
     */
    deleted: (id: string) => ApiResponse;
};
//# sourceMappingURL=response-formatter.d.ts.map