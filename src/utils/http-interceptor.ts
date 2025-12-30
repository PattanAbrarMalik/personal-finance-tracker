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

export class HttpInterceptor {
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private errorInterceptors: ErrorInterceptor[] = [];

  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  addErrorInterceptor(interceptor: ErrorInterceptor): void {
    this.errorInterceptors.push(interceptor);
  }

  async processRequest(request: HttpRequest): Promise<HttpRequest> {
    let processed = request;
    for (const interceptor of this.requestInterceptors) {
      processed = await interceptor(processed);
    }
    return processed;
  }

  async processResponse(response: HttpResponse): Promise<HttpResponse> {
    let processed = response;
    for (const interceptor of this.responseInterceptors) {
      processed = await interceptor(processed);
    }
    return processed;
  }

  processError(error: Error): void {
    for (const interceptor of this.errorInterceptors) {
      interceptor(error);
    }
  }
}

/**
 * Common interceptor implementations
 */
export const CommonInterceptors = {
  /**
   * Add Bearer token to all requests
   */
  bearerToken: (token: string): RequestInterceptor => (request: HttpRequest) => ({
    ...request,
    headers: {
      ...request.headers,
      Authorization: `Bearer ${token}`,
    },
  }),

  /**
   * Add request ID header
   */
  requestId: (): RequestInterceptor => (request: HttpRequest) => ({
    ...request,
    headers: {
      ...request.headers,
      'X-Request-ID': Math.random().toString(36).substring(7),
    },
  }),

  /**
   * Log all requests
   */
  logging: (): RequestInterceptor => (request: HttpRequest) => {
    console.log(`[${request.method}] ${request.url}`);
    return request;
  },

  /**
   * Add timeout to requests
   */
  timeout: (ms: number): RequestInterceptor => {
    return (request: HttpRequest) => {
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), ms)
      );
      return Promise.race([Promise.resolve(request), timeoutPromise]);
    };
  },

  /**
   * Retry failed requests
   */
  retry: (maxAttempts: number = 3): ResponseInterceptor => {
    let attempts = 0;
    return (response: HttpResponse) => {
      if (response.status >= 500 && attempts < maxAttempts) {
        attempts++;
        console.log(`Retrying request (${attempts}/${maxAttempts})`);
        return response;
      }
      return response;
    };
  },
};
