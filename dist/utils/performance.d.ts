/**
 * Performance monitoring and debugging utilities
 */
interface PerformanceMetric {
    name: string;
    duration: number;
    startTime: number;
    endTime: number;
    metadata?: Record<string, any>;
}
export declare class PerformanceMonitor {
    private static metrics;
    private static timers;
    /**
     * Start measuring performance
     */
    static start(label: string): void;
    /**
     * End measuring and record metric
     */
    static end(label: string, metadata?: Record<string, any>): PerformanceMetric;
    /**
     * Get all metrics for a label
     */
    static getMetrics(label: string): PerformanceMetric[];
    /**
     * Get average duration for a label
     */
    static getAverageDuration(label: string): number;
    /**
     * Get slowest metric
     */
    static getSlowest(label: string): PerformanceMetric | null;
    /**
     * Clear metrics
     */
    static clear(label?: string): void;
    /**
     * Print report
     */
    static report(): void;
}
/**
 * Memory leak detection
 */
export declare class MemoryMonitor {
    private static snapshots;
    private static interval;
    static startMonitoring(intervalMs?: number): void;
    static stopMonitoring(): void;
    static getSnapshots(): Map<number, NodeJS.MemoryUsage>;
    static detectLeaks(): boolean;
    static clear(): void;
}
/**
 * Debug logger with levels
 */
export declare enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3
}
export declare class DebugLogger {
    private static level;
    static setLevel(level: LogLevel): void;
    static debug(message: string, data?: any): void;
    static info(message: string, data?: any): void;
    static warn(message: string, data?: any): void;
    static error(message: string, error?: any): void;
    static table(data: any): void;
}
export {};
//# sourceMappingURL=performance.d.ts.map