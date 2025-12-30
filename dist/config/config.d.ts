/**
 * Application configuration
 * Environment variables should be set in .env file
 */
export declare const config: {
    readonly port: number;
    readonly nodeEnv: "development" | "production" | "test";
    readonly appUrl: string;
    readonly frontendUrl: string;
    readonly corsOrigin: string[];
    readonly databaseUrl: string;
    readonly jwtSecret: string;
    readonly jwtExpiresIn: string;
    readonly googleOAuthClientId: string;
    readonly googleOAuthClientSecret: string;
    readonly sentryDsn: string;
    readonly sentryEnvironment: string;
    readonly sentryTracesSampleRate: number;
    readonly rateLimitWindowMs: number;
    readonly rateLimitMaxRequests: number;
    readonly logLevel: string;
    readonly isProduction: boolean;
    readonly isDevelopment: boolean;
};
//# sourceMappingURL=config.d.ts.map