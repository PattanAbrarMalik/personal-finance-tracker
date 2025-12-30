declare class Logger {
    private formatMessage;
    private log;
    error(message: string, error?: Error, metadata?: Record<string, unknown>): void;
    warn(message: string, error?: Error, metadata?: Record<string, unknown>): void;
    info(message: string, metadata?: Record<string, unknown>): void;
    debug(message: string, metadata?: Record<string, unknown>): void;
}
export declare const logger: Logger;
export {};
//# sourceMappingURL=logger.d.ts.map