"use strict";
/**
 * Request/Response interceptor utilities
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonInterceptors = exports.HttpInterceptor = void 0;
class HttpInterceptor {
    requestInterceptors = [];
    responseInterceptors = [];
    errorInterceptors = [];
    addRequestInterceptor(interceptor) {
        this.requestInterceptors.push(interceptor);
    }
    addResponseInterceptor(interceptor) {
        this.responseInterceptors.push(interceptor);
    }
    addErrorInterceptor(interceptor) {
        this.errorInterceptors.push(interceptor);
    }
    async processRequest(request) {
        let processed = request;
        for (const interceptor of this.requestInterceptors) {
            processed = await interceptor(processed);
        }
        return processed;
    }
    async processResponse(response) {
        let processed = response;
        for (const interceptor of this.responseInterceptors) {
            processed = await interceptor(processed);
        }
        return processed;
    }
    processError(error) {
        for (const interceptor of this.errorInterceptors) {
            interceptor(error);
        }
    }
}
exports.HttpInterceptor = HttpInterceptor;
/**
 * Common interceptor implementations
 */
exports.CommonInterceptors = {
    /**
     * Add Bearer token to all requests
     */
    bearerToken: (token) => (request) => ({
        ...request,
        headers: {
            ...request.headers,
            Authorization: `Bearer ${token}`,
        },
    }),
    /**
     * Add request ID header
     */
    requestId: () => (request) => ({
        ...request,
        headers: {
            ...request.headers,
            'X-Request-ID': Math.random().toString(36).substring(7),
        },
    }),
    /**
     * Log all requests
     */
    logging: () => (request) => {
        console.log(`[${request.method}] ${request.url}`);
        return request;
    },
    /**
     * Add timeout to requests
     */
    timeout: (ms) => {
        return (request) => {
            const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Request timeout')), ms));
            return Promise.race([Promise.resolve(request), timeoutPromise]);
        };
    },
    /**
     * Retry failed requests
     */
    retry: (maxAttempts = 3) => {
        let attempts = 0;
        return (response) => {
            if (response.status >= 500 && attempts < maxAttempts) {
                attempts++;
                console.log(`Retrying request (${attempts}/${maxAttempts})`);
                return response;
            }
            return response;
        };
    },
};
//# sourceMappingURL=http-interceptor.js.map