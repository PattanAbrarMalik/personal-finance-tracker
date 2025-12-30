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

export class PerformanceMonitor {
  private static metrics: Map<string, PerformanceMetric[]> = new Map();
  private static timers: Map<string, number> = new Map();

  /**
   * Start measuring performance
   */
  static start(label: string): void {
    this.timers.set(label, performance.now());
  }

  /**
   * End measuring and record metric
   */
  static end(label: string, metadata?: Record<string, any>): PerformanceMetric {
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

    const metric: PerformanceMetric = {
      name: label,
      duration,
      startTime,
      endTime,
      metadata,
    };

    this.metrics.get(label)!.push(metric);
    this.timers.delete(label);

    return metric;
  }

  /**
   * Get all metrics for a label
   */
  static getMetrics(label: string): PerformanceMetric[] {
    return this.metrics.get(label) || [];
  }

  /**
   * Get average duration for a label
   */
  static getAverageDuration(label: string): number {
    const metrics = this.getMetrics(label);
    if (metrics.length === 0) return 0;
    const total = metrics.reduce((sum, m) => sum + m.duration, 0);
    return total / metrics.length;
  }

  /**
   * Get slowest metric
   */
  static getSlowest(label: string): PerformanceMetric | null {
    const metrics = this.getMetrics(label);
    return metrics.reduce((max, m) => (m.duration > (max?.duration || 0) ? m : max), null as PerformanceMetric | null);
  }

  /**
   * Clear metrics
   */
  static clear(label?: string): void {
    if (label) {
      this.metrics.delete(label);
    } else {
      this.metrics.clear();
    }
  }

  /**
   * Print report
   */
  static report(): void {
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

/**
 * Memory leak detection
 */
export class MemoryMonitor {
  private static snapshots: Map<number, NodeJS.MemoryUsage> = new Map();
  private static interval: NodeJS.Timer | null = null;

  static startMonitoring(intervalMs: number = 5000): void {
    this.interval = setInterval(() => {
      const memory = process.memoryUsage();
      this.snapshots.set(Date.now(), memory);
    }, intervalMs);
  }

  static stopMonitoring(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  static getSnapshots(): Map<number, NodeJS.MemoryUsage> {
    return this.snapshots;
  }

  static detectLeaks(): boolean {
    const snapshots = Array.from(this.snapshots.values());
    if (snapshots.length < 2) return false;

    const heapUsages = snapshots.map(s => s.heapUsed);
    let increasingTrend = 0;

    for (let i = 1; i < heapUsages.length; i++) {
      if (heapUsages[i] > heapUsages[i - 1]) {
        increasingTrend++;
      }
    }

    return increasingTrend > snapshots.length * 0.7;
  }

  static clear(): void {
    this.snapshots.clear();
  }
}

/**
 * Debug logger with levels
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export class DebugLogger {
  private static level: LogLevel = LogLevel.INFO;

  static setLevel(level: LogLevel): void {
    this.level = level;
  }

  static debug(message: string, data?: any): void {
    if (this.level <= LogLevel.DEBUG) {
      console.debug(`[DEBUG] ${message}`, data || '');
    }
  }

  static info(message: string, data?: any): void {
    if (this.level <= LogLevel.INFO) {
      console.info(`[INFO] ${message}`, data || '');
    }
  }

  static warn(message: string, data?: any): void {
    if (this.level <= LogLevel.WARN) {
      console.warn(`[WARN] ${message}`, data || '');
    }
  }

  static error(message: string, error?: any): void {
    if (this.level <= LogLevel.ERROR) {
      console.error(`[ERROR] ${message}`, error || '');
    }
  }

  static table(data: any): void {
    if (this.level <= LogLevel.DEBUG) {
      console.table(data);
    }
  }
}
