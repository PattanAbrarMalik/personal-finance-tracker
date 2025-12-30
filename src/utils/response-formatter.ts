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

export const responseFormatter = {
  /**
   * Success response
   */
  success: <T>(data: T, meta?: any): ApiResponse<T> => ({
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
  paginated: <T>(
    data: T[],
    total: number,
    page: number,
    limit: number
  ): PaginatedResponse<T> => ({
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
  error: (code: string, message: string, details?: any): ApiResponse => ({
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
  created: <T>(data: T): ApiResponse<T> => ({
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
  deleted: (id: string): ApiResponse => ({
    success: true,
    data: { id, deleted: true },
    meta: {
      timestamp: new Date().toISOString(),
      version: '1.0',
    },
  }),
};
