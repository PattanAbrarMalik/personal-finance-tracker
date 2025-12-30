/**
 * Advanced API integration utilities
 */
export interface PaginationParams {
    page: number;
    limit: number;
    sort?: string;
    order?: 'asc' | 'desc';
}
export interface FilterParams {
    [key: string]: any;
}
export declare class APIBuilder {
    private baseUrl;
    constructor(baseUrl: string);
    private buildQuery;
    getUrl(endpoint: string, params?: Record<string, any>): string;
    list(endpoint: string, pagination?: PaginationParams, filters?: FilterParams): string;
    get(endpoint: string, id: string): string;
    create(endpoint: string): string;
    update(endpoint: string, id: string): string;
    delete(endpoint: string, id: string): string;
    action(endpoint: string, id: string, action: string): string;
}
/**
 * Batch request processor
 */
export declare class BatchRequestProcessor {
    processBatch(urls: string[], method?: 'GET' | 'POST', options?: RequestInit): Promise<Response[]>;
    processSequentially(urls: string[], method?: 'GET' | 'POST', delayMs?: number): Promise<Response[]>;
}
/**
 * API versioning helper
 */
export declare class APIVersionManager {
    private currentVersion;
    private supportedVersions;
    constructor(initialVersion?: string);
    setCurrentVersion(version: string): void;
    getCurrentVersion(): string;
    mapEndpoint(endpoint: string, version: string): string;
    registerMapping(endpoint: string, version: string, mappedEndpoint: string): void;
    supportsVersion(version: string): boolean;
}
/**
 * API response normalization
 */
export interface NormalizedData {
    entities: Record<string, Record<string, any>>;
    result: string | string[];
}
export declare class DataNormalizer {
    static normalize(data: any, schema: Record<string, {
        key: string;
        normalize?: (value: any) => any;
    }>): NormalizedData;
    private static normalizeItem;
    static denormalize(normalized: NormalizedData, entityType: string): any;
}
//# sourceMappingURL=api-builders.d.ts.map