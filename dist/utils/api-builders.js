"use strict";
/**
 * Advanced API integration utilities
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataNormalizer = exports.APIVersionManager = exports.BatchRequestProcessor = exports.APIBuilder = void 0;
class APIBuilder {
    baseUrl;
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }
    buildQuery(params) {
        const entries = Object.entries(params)
            .filter(([, value]) => value !== undefined && value !== null)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
        return entries.length > 0 ? '?' + entries.join('&') : '';
    }
    getUrl(endpoint, params) {
        const query = params ? this.buildQuery(params) : '';
        return `${this.baseUrl}${endpoint}${query}`;
    }
    list(endpoint, pagination, filters) {
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
    get(endpoint, id) {
        return this.getUrl(`${endpoint}/${id}`);
    }
    create(endpoint) {
        return this.getUrl(endpoint);
    }
    update(endpoint, id) {
        return this.getUrl(`${endpoint}/${id}`);
    }
    delete(endpoint, id) {
        return this.getUrl(`${endpoint}/${id}`);
    }
    action(endpoint, id, action) {
        return this.getUrl(`${endpoint}/${id}/${action}`);
    }
}
exports.APIBuilder = APIBuilder;
/**
 * Batch request processor
 */
class BatchRequestProcessor {
    async processBatch(urls, method = 'GET', options) {
        const requests = urls.map(url => fetch(url, { method, ...options }).catch(error => {
            console.error(`Request failed for ${url}:`, error);
            throw error;
        }));
        return Promise.all(requests);
    }
    async processSequentially(urls, method = 'GET', delayMs = 100) {
        const results = [];
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
exports.BatchRequestProcessor = BatchRequestProcessor;
/**
 * API versioning helper
 */
class APIVersionManager {
    currentVersion;
    supportedVersions = new Map();
    constructor(initialVersion = 'v1') {
        this.currentVersion = initialVersion;
    }
    setCurrentVersion(version) {
        this.currentVersion = version;
    }
    getCurrentVersion() {
        return this.currentVersion;
    }
    mapEndpoint(endpoint, version) {
        const mapped = this.supportedVersions.get(`${endpoint}:${version}`);
        return mapped || endpoint;
    }
    registerMapping(endpoint, version, mappedEndpoint) {
        this.supportedVersions.set(`${endpoint}:${version}`, mappedEndpoint);
    }
    supportsVersion(version) {
        return Array.from(this.supportedVersions.keys()).some(key => key.endsWith(`:${version}`));
    }
}
exports.APIVersionManager = APIVersionManager;
class DataNormalizer {
    static normalize(data, schema) {
        const entities = {};
        const result = [];
        if (Array.isArray(data)) {
            for (const item of data) {
                this.normalizeItem(item, schema, entities, result);
            }
        }
        else {
            this.normalizeItem(data, schema, entities, result);
        }
        return {
            entities,
            result: result.length === 1 ? result[0] : result,
        };
    }
    static normalizeItem(item, schema, entities, result) {
        for (const [key, config] of Object.entries(schema)) {
            const { key: idKey, normalize } = config;
            const id = item[idKey];
            if (!entities[key]) {
                entities[key] = {};
            }
            entities[key][id] = normalize ? normalize(item) : item;
            result.push(`${key}:${id}`);
        }
    }
    static denormalize(normalized, entityType) {
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
exports.DataNormalizer = DataNormalizer;
//# sourceMappingURL=api-builders.js.map