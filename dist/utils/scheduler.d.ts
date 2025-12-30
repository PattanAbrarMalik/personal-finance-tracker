/**
 * Advanced scheduling and job queue utilities
 */
export interface Job<T = any> {
    id: string;
    name: string;
    handler: () => Promise<T>;
    status: 'pending' | 'running' | 'completed' | 'failed';
    result?: T;
    error?: Error;
    createdAt: Date;
    startedAt?: Date;
    completedAt?: Date;
}
export declare class JobQueue {
    private jobs;
    private queue;
    private running;
    private maxConcurrent;
    private activeJobs;
    addJob<T>(name: string, handler: () => Promise<T>): string;
    start(): Promise<void>;
    private executeJob;
    getJob(id: string): Job | undefined;
    stop(): void;
    clear(): void;
}
/**
 * Scheduler for recurring tasks
 */
export declare class TaskScheduler {
    private tasks;
    scheduleInterval(taskId: string, intervalMs: number, handler: () => Promise<void>): void;
    scheduleCron(taskId: string, cronExpression: string, handler: () => Promise<void>): void;
    stopTask(taskId: string): void;
    stopAll(): void;
}
/**
 * Debounced job execution
 */
export declare class DebouncedJobRunner {
    private timers;
    run(jobId: string, handler: () => Promise<void>, delayMs?: number): void;
    cancel(jobId: string): void;
    cancelAll(): void;
}
/**
 * Throttled execution
 */
export declare class ThrottledExecutor {
    private lastExecutionTime;
    execute(jobId: string, handler: () => Promise<void>, minIntervalMs?: number): Promise<void>;
    reset(jobId?: string): void;
}
//# sourceMappingURL=scheduler.d.ts.map