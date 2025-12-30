/**
 * Comprehensive configuration management
 */

export interface AppConfig {
  env: 'development' | 'staging' | 'production';
  debug: boolean;
  api: {
    baseUrl: string;
    timeout: number;
    retryAttempts: number;
  };
  auth: {
    tokenExpiry: number;
    refreshTokenExpiry: number;
  };
  cache: {
    enabled: boolean;
    ttl: number;
  };
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error';
    format: 'json' | 'plain';
  };
  features: Record<string, boolean>;
}

export class ConfigManager {
  private config: AppConfig;
  private overrides: Partial<AppConfig> = {};

  constructor(defaultConfig: AppConfig) {
    this.config = defaultConfig;
  }

  get<K extends keyof AppConfig>(key: K): AppConfig[K] {
    return this.overrides[key] ?? this.config[key];
  }

  set<K extends keyof AppConfig>(key: K, value: AppConfig[K]): void {
    this.overrides[key] = value;
  }

  getAll(): AppConfig {
    return { ...this.config, ...this.overrides };
  }

  merge(partial: Partial<AppConfig>): void {
    this.overrides = { ...this.overrides, ...partial };
  }

  reset(): void {
    this.overrides = {};
  }

  isProduction(): boolean {
    return this.get('env') === 'production';
  }

  isStaging(): boolean {
    return this.get('env') === 'staging';
  }

  isDevelopment(): boolean {
    return this.get('env') === 'development';
  }

  isDebugEnabled(): boolean {
    return this.get('debug');
  }

  isFeatureEnabled(featureName: string): boolean {
    return this.get('features')[featureName] ?? false;
  }

  validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.config.env) errors.push('Environment is required');
    if (!this.config.api.baseUrl) errors.push('API base URL is required');
    if (this.config.api.timeout <= 0) errors.push('API timeout must be positive');

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

/**
 * Environment-based configuration loader
 */
export class EnvironmentConfigLoader {
  static loadFromEnv(): AppConfig {
    const env = (process.env.NODE_ENV || 'development') as any;
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
        level: (process.env.LOG_LEVEL || 'info') as any,
        format: (process.env.LOG_FORMAT || 'json') as any,
      },
      features: this.loadFeatureFlags(),
    };
  }

  private static loadFeatureFlags(): Record<string, boolean> {
    const flags: Record<string, boolean> = {};
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

/**
 * Configuration validator with schema
 */
export class ConfigValidator {
  private schema: Record<string, { type: string; required: boolean; validate?: (value: any) => boolean }> = {};

  addRule(path: string, type: string, required: boolean = true, validate?: (value: any) => boolean): void {
    this.schema[path] = { type, required, validate };
  }

  validate(config: Record<string, any>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

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

  private getValueByPath(obj: Record<string, any>, path: string): any {
    return path.split('.').reduce((current, part) => current?.[part], obj);
  }
}
