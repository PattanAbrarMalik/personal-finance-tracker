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
export declare class ConfigManager {
    private config;
    private overrides;
    constructor(defaultConfig: AppConfig);
    get<K extends keyof AppConfig>(key: K): AppConfig[K];
    set<K extends keyof AppConfig>(key: K, value: AppConfig[K]): void;
    getAll(): AppConfig;
    merge(partial: Partial<AppConfig>): void;
    reset(): void;
    isProduction(): boolean;
    isStaging(): boolean;
    isDevelopment(): boolean;
    isDebugEnabled(): boolean;
    isFeatureEnabled(featureName: string): boolean;
    validate(): {
        valid: boolean;
        errors: string[];
    };
}
/**
 * Environment-based configuration loader
 */
export declare class EnvironmentConfigLoader {
    static loadFromEnv(): AppConfig;
    private static loadFeatureFlags;
}
/**
 * Configuration validator with schema
 */
export declare class ConfigValidator {
    private schema;
    addRule(path: string, type: string, required?: boolean, validate?: (value: any) => boolean): void;
    validate(config: Record<string, any>): {
        valid: boolean;
        errors: string[];
    };
    private getValueByPath;
}
//# sourceMappingURL=config-manager.d.ts.map