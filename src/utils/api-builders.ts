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

export class APIBuilder {
  constructor(private baseUrl: string) {}

  private buildQuery(params: Record<string, any>): string {
    const entries = Object.entries(params)
      .filter(([, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    return entries.length > 0 ? '?' + entries.join('&') : '';
  }

  getUrl(endpoint: string, params?: Record<string, any>): string {
    const query = params ? this.buildQuery(params) : '';
    return `${this.baseUrl}${endpoint}${query}`;
  }

  list(endpoint: string, pagination?: PaginationParams, filters?: FilterParams) {
    const params = {
      ...(pagination && {
        page: pagination.page,
        limit: pagination.limit,
        ...(pagination.sort && { sort: pagination.sort }),
        ...(pagination.order && { order: pagination.order }),
      }),
      ...filters,
    };
    return this.getUrl(endpoint, params);
  }

  get(endpoint: string, id: string) {
    return this.getUrl(`${endpoint}/${id}`);
  }

  create(endpoint: string) {
    return this.getUrl(endpoint);
  }

  update(endpoint: string, id: string) {
    return this.getUrl(`${endpoint}/${id}`);
  }

  delete(endpoint: string, id: string) {
    return this.getUrl(`${endpoint}/${id}`);
  }

  action(endpoint: string, id: string, action: string) {
    return this.getUrl(`${endpoint}/${id}/${action}`);
  }
}

/**
 * Batch request processor
 */
export class BatchRequestProcessor {
  async processBatch(
    urls: string[],
    method: 'GET' | 'POST' = 'GET',
    options?: RequestInit
  ): Promise<Response[]> {
    const requests = urls.map(url =>
      fetch(url, { method, ...options }).catch(error => {
        console.error(`Request failed for ${url}:`, error);
        throw error;
      })
    );

    return Promise.all(requests);
  }

  async processSequentially(
    urls: string[],
    method: 'GET' | 'POST' = 'GET',
    delayMs: number = 100
  ): Promise<Response[]> {
    const results: Response[] = [];

    for (const url of urls) {
      const response = await fetch(url, { method });
      results.push(response);

      if (url !== urls[urls.length - 1]) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }

    return results;
  }
}

/**
 * API versioning helper
 */
export class APIVersionManager {
  private currentVersion: string;
  private supportedVersions: Map<string, string> = new Map();

  constructor(initialVersion: string = 'v1') {
    this.currentVersion = initialVersion;
  }

  setCurrentVersion(version: string): void {
    this.currentVersion = version;
  }

  getCurrentVersion(): string {
    return this.currentVersion;
  }

  mapEndpoint(endpoint: string, version: string): string {
    const mapped = this.supportedVersions.get(`${endpoint}:${version}`);
    return mapped || endpoint;
  }

  registerMapping(endpoint: string, version: string, mappedEndpoint: string): void {
    this.supportedVersions.set(`${endpoint}:${version}`, mappedEndpoint);
  }

  supportsVersion(version: string): boolean {
    return Array.from(this.supportedVersions.keys()).some(key => key.endsWith(`:${version}`));
  }
}

/**
 * API response normalization
 */
export interface NormalizedData {
  entities: Record<string, Record<string, any>>;
  result: string | string[];
}

export class DataNormalizer {
  static normalize(
    data: any,
    schema: Record<string, { key: string; normalize?: (value: any) => any }>
  ): NormalizedData {
    const entities: Record<string, Record<string, any>> = {};
    const result: string[] = [];

    if (Array.isArray(data)) {
      for (const item of data) {
        this.normalizeItem(item, schema, entities, result);
      }
    } else {
      this.normalizeItem(data, schema, entities, result);
    }

    return {
      entities,
      result: result.length === 1 ? result[0] : result,
    };
  }

  private static normalizeItem(
    item: any,
    schema: Record<string, any>,
    entities: Record<string, Record<string, any>>,
    result: string[]
  ): void {
    for (const [key, config] of Object.entries(schema)) {
      const { key: idKey, normalize } = config as any;
      const id = item[idKey];

      if (!entities[key]) {
        entities[key] = {};
      }

      entities[key][id] = normalize ? normalize(item) : item;
      result.push(`${key}:${id}`);
    }
  }

  static denormalize(normalized: NormalizedData, entityType: string): any {
    if (typeof normalized.result === 'string') {
      const [type, id] = normalized.result.split(':');
      return normalized.entities[type]?.[id];
    }

    return normalized.result.map(ref => {
      const [type, id] = ref.split(':');
      return normalized.entities[type]?.[id];
    });
  }
}
