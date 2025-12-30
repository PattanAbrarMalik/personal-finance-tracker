"use strict";
/**
 * Performance monitoring and debugging utilities
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebugLogger = exports.LogLevel = exports.MemoryMonitor = exports.PerformanceMonitor = void 0;
class PerformanceMonitor {
    static metrics = new Map();
    static timers = new Map();
    /**
     * Start measuring performance
     */
    static start(label) {
        this.timers.set(label, performance.now());
    }
    /**
     * End measuring and record metric
     */
    static end(label, metadata) {
        const startTime = this.timers.get(label);
        if (!startTime) {
            console.warn(`No timer found for label: ${label}`);
            return {
                name: label,
                duration: 0,
                startTime: 0,
                endTime: 0,
            };
        }
        const endTime = performance.now();
        const duration = endTime - startTime;
        if (!this.metrics.has(label)) {
            this.metrics.set(label, []);
        }
        const metric = {
            name: label,
            duration,
            startTime,
            endTime,
            metadata,
        };
        this.metrics.get(label).push(metric);
        this.timers.delete(label);
        return metric;
    }
    /**
     * Get all metrics for a label
     */
    static getMetrics(label) {
        return this.metrics.get(label) || [];
    }
    /**
     * Get average duration for a label
     */
    static getAverageDuration(label) {
        const metrics = this.getMetrics(label);
        if (metrics.length === 0)
            return 0;
        const total = metrics.reduce((sum, m) => sum + m.duration, 0);
        return total / metrics.length;
    }
    /**
     * Get slowest metric
     */
    static getSlowest(label) {
        const metrics = this.getMetrics(label);
        return metrics.reduce((max, m) => (m.duration > (max?.duration || 0) ? m : max), null);
    }
    /**
     * Clear metrics
     */
    static clear(label) {
        if (label) {
            this.metrics.delete(label);
        }
        else {
            this.metrics.clear();
        }
    }
    /**
     * Print report
     */
    static report() {
        console.group('Performance Report');
        for (const [label, metrics] of this.metrics) {
            const avg = this.getAverageDuration(label);
            const slowest = this.getSlowest(label);
            console.log(`${label}:`, {
                calls: metrics.length,
                average: `${avg.toFixed(2)}ms`,
                slowest: `${slowest?.duration.toFixed(2)}ms`,
            });
        }
        console.groupEnd();
    }
}
exports.PerformanceMonitor = PerformanceMonitor;
/**
 * Memory leak detection
 */
class MemoryMonitor {
    static snapshots = new Map();
    static interval = null;
    static startMonitoring(intervalMs = 5000) {
        this.interval = setInterval(() => {
            const memory = process.memoryUsage();
            this.snapshots.set(Date.now(), memory);
        }, intervalMs);
    }
    static stopMonitoring() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }
    static getSnapshots() {
        return this.snapshots;
    }
    static detectLeaks() {
        const snapshots = Array.from(this.snapshots.values());
        if (snapshots.length < 2)
            return false;
        const heapUsages = snapshots.map(s => s.heapUsed);
        let increasingTrend = 0;
        for (let i = 1; i < heapUsages.length; i++) {
            if (heapUsages[i] > heapUsages[i - 1]) {
                increasingTrend++;
            }
        }
        return increasingTrend > snapshots.length * 0.7;
    }
    static clear() {
        this.snapshots.clear();
    }
}
exports.MemoryMonitor = MemoryMonitor;
/**
 * Debug logger with levels
 */
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 1] = "INFO";
    LogLevel[LogLevel["WARN"] = 2] = "WARN";
    LogLevel[LogLevel["ERROR"] = 3] = "ERROR";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
class DebugLogger {
    static level = LogLevel.INFO;
    static setLevel(level) {
        this.level = level;
    }
    static debug(message, data) {
        if (this.level <= LogLevel.DEBUG) {
            console.debug(`[DEBUG] ${message}`, data || '');
        }
    }
    static info(message, data) {
        if (this.level <= LogLevel.INFO) {
            console.info(`[INFO] ${message}`, data || '');
        }
    }
    static warn(message, data) {
        if (this.level <= LogLevel.WARN) {
            console.warn(`[WARN] ${message}`, data || '');
        }
    }
    static error(message, error) {
        if (this.level <= LogLevel.ERROR) {
            console.error(`[ERROR] ${message}`, error || '');
        }
    }
    static table(data) {
        if (this.level <= LogLevel.DEBUG) {
            console.table(data);
        }
    }
}
exports.DebugLogger = DebugLogger;
//# sourceMappingURL=performance.js.map