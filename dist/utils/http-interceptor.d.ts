/**
 * Request/Response interceptor utilities
 */
export interface HttpRequest {
    method: string;
    url: string;
    headers: Record<string, string>;
    body?: any;
}
export interface HttpResponse {
    status: number;
    headers: Record<string, string>;
    body: any;
}
export type RequestInterceptor = (request: HttpRequest) => HttpRequest | Promise<HttpRequest>;
export type ResponseInterceptor = (response: HttpResponse) => HttpResponse | Promise<HttpResponse>;
export type ErrorInterceptor = (error: Error) => void;
export declare class HttpInterceptor {
    private requestInterceptors;
    private responseInterceptors;
    private errorInterceptors;
    addRequestInterceptor(interceptor: RequestInterceptor): void;
    addResponseInterceptor(interceptor: ResponseInterceptor): void;
    addErrorInterceptor(interceptor: ErrorInterceptor): void;
    processRequest(request: HttpRequest): Promise<HttpRequest>;
    processResponse(response: HttpResponse): Promise<HttpResponse>;
    processError(error: Error): void;
}
/**
 * Common interceptor implementations
 */
export declare const CommonInterceptors: {
    /**
     * Add Bearer token to all requests
     */
    bearerToken: (token: string) => RequestInterceptor;
    /**
     * Add request ID header
     */
    requestId: () => RequestInterceptor;
    /**
     * Log all requests
     */
    logging: () => RequestInterceptor;
    /**
     * Add timeout to requests
     */
    timeout: (ms: number) => RequestInterceptor;
    /**
     * Retry failed requests
     */
    retry: (maxAttempts?: number) => ResponseInterceptor;
};
//# sourceMappingURL=http-interceptor.d.ts.map