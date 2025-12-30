"use strict";
/**
 * Comprehensive configuration management
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigValidator = exports.EnvironmentConfigLoader = exports.ConfigManager = void 0;
class ConfigManager {
    config;
    overrides = {};
    constructor(defaultConfig) {
        this.config = defaultConfig;
    }
    get(key) {
        return this.overrides[key] ?? this.config[key];
    }
    set(key, value) {
        this.overrides[key] = value;
    }
    getAll() {
        return { ...this.config, ...this.overrides };
    }
    merge(partial) {
        this.overrides = { ...this.overrides, ...partial };
    }
    reset() {
        this.overrides = {};
    }
    isProduction() {
        return this.get('env') === 'production';
    }
    isStaging() {
        return this.get('env') === 'staging';
    }
    isDevelopment() {
        return this.get('env') === 'development';
    }
    isDebugEnabled() {
        return this.get('debug');
    }
    isFeatureEnabled(featureName) {
        return this.get('features')[featureName] ?? false;
    }
    validate() {
        const errors = [];
        if (!this.config.env)
            errors.push('Environment is required');
        if (!this.config.api.baseUrl)
            errors.push('API base URL is required');
        if (this.config.api.timeout <= 0)
            errors.push('API timeout must be positive');
        return {
            valid: errors.length === 0,
            errors,
        };
    }
}
exports.ConfigManager = ConfigManager;
/**
 * Environment-based configuration loader
 */
class EnvironmentConfigLoader {
    static loadFromEnv() {
        const env = (process.env.NODE_ENV || 'development');
        const baseUrl = process.env.API_BASE_URL || 'http://localhost:3000';
        const timeout = parseInt(process.env.API_TIMEOUT || '30000', 10);
        return {
            env,
            debug: env === 'development',
            api: {
                baseUrl,
                timeout,
                retryAttempts: parseInt(process.env.API_RETRY_ATTEMPTS || '3', 10),
            },
            auth: {
                tokenExpiry: parseInt(process.env.TOKEN_EXPIRY || '3600000', 10),
                refreshTokenExpiry: parseInt(process.env.REFRESH_TOKEN_EXPIRY || '7200000', 10),
            },
            cache: {
                enabled: process.env.CACHE_ENABLED !== 'false',
                ttl: parseInt(process.env.CACHE_TTL || '300000', 10),
            },
            logging: {
                level: (process.env.LOG_LEVEL || 'info'),
                format: (process.env.LOG_FORMAT || 'json'),
            },
            features: this.loadFeatureFlags(),
        };
    }
    static loadFeatureFlags() {
        const flags = {};
        const prefix = 'FEATURE_';
        for (const [key, value] of Object.entries(process.env)) {
            if (key.startsWith(prefix)) {
                const featureName = key.substring(prefix.length).toLowerCase();
                flags[featureName] = value === 'true' || value === '1';
            }
        }
        return flags;
    }
}
exports.EnvironmentConfigLoader = EnvironmentConfigLoader;
/**
 * Configuration validator with schema
 */
class ConfigValidator {
    schema = {};
    addRule(path, type, required = true, validate) {
        this.schema[path] = { type, required, validate };
    }
    validate(config) {
        const errors = [];
        for (const [path, rule] of Object.entries(this.schema)) {
            const value = this.getValueByPath(config, path);
            if (rule.required && (value === undefined || value === null)) {
                errors.push(`${path} is required`);
                continue;
            }
            if (value !== undefined && typeof value !== rule.type) {
                errors.push(`${path} must be of type ${rule.type}, got ${typeof value}`);
            }
            if (rule.validate && !rule.validate(value)) {
                errors.push(`${path} validation failed`);
            }
        }
        return {
            valid: errors.length === 0,
            errors,
        };
    }
    getValueByPath(obj, path) {
        return path.split('.').reduce((current, part) => current?.[part], obj);
    }
}
exports.ConfigValidator = ConfigValidator;
//# sourceMappingURL=config-manager.js.map