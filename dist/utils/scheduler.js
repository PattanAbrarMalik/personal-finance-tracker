"use strict";
/**
 * Advanced scheduling and job queue utilities
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThrottledExecutor = exports.DebouncedJobRunner = exports.TaskScheduler = exports.JobQueue = void 0;
class JobQueue {
    jobs = new Map();
    queue = [];
    running = false;
    maxConcurrent = 1;
    activeJobs = 0;
    addJob(name, handler) {
        const id = Math.random().toString(36).substring(7);
        const job = {
            id,
            name,
            handler,
            status: 'pending',
            createdAt: new Date(),
        };
        this.jobs.set(id, job);
        this.queue.push(id);
        return id;
    }
    async start() {
        if (this.running)
            return;
        this.running = true;
        while (this.queue.length > 0) {
            if (this.activeJobs < this.maxConcurrent) {
                const jobId = this.queue.shift();
                if (jobId) {
                    this.executeJob(jobId);
                }
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        this.running = false;
    }
    async executeJob(jobId) {
        const job = this.jobs.get(jobId);
        if (!job)
            return;
        job.status = 'running';
        job.startedAt = new Date();
        this.activeJobs++;
        try {
            job.result = await job.handler();
            job.status = 'completed';
        }
        catch (error) {
            job.status = 'failed';
            job.error = error;
        }
        finally {
            job.completedAt = new Date();
            this.activeJobs--;
        }
    }
    getJob(id) {
        return this.jobs.get(id);
    }
    stop() {
        this.running = false;
    }
    clear() {
        this.jobs.clear();
        this.queue = [];
    }
}
exports.JobQueue = JobQueue;
/**
 * Scheduler for recurring tasks
 */
class TaskScheduler {
    tasks = new Map();
    scheduleInterval(taskId, intervalMs, handler) {
        const interval = setInterval(async () => {
            try {
                await handler();
            }
            catch (error) {
                console.error(`Task ${taskId} failed:`, error);
            }
        }, intervalMs);
        this.tasks.set(taskId, { interval, handler });
    }
    scheduleCron(taskId, cronExpression, handler) {
        // Simple cron: "0 * * * *" = every hour at minute 0
        // This is a simplified implementation
        const parts = cronExpression.split(' ');
        const [minute, hour] = parts;
        const checkAndRun = async () => {
            const now = new Date();
            const shouldRun = (minute === '*' || parseInt(minute) === now.getMinutes()) &&
                (hour === '*' || parseInt(hour) === now.getHours());
            if (shouldRun) {
                try {
                    await handler();
                }
                catch (error) {
                    console.error(`Task ${taskId} failed:`, error);
                }
            }
        };
        const interval = setInterval(checkAndRun, 60000); // Check every minute
        this.tasks.set(taskId, { interval, handler });
    }
    stopTask(taskId) {
        const task = this.tasks.get(taskId);
        if (task) {
            clearInterval(task.interval);
            this.tasks.delete(taskId);
        }
    }
    stopAll() {
        for (const [, task] of this.tasks) {
            clearInterval(task.interval);
        }
        this.tasks.clear();
    }
}
exports.TaskScheduler = TaskScheduler;
/**
 * Debounced job execution
 */
class DebouncedJobRunner {
    timers = new Map();
    run(jobId, handler, delayMs = 1000) {
        const existing = this.timers.get(jobId);
        if (existing) {
            clearTimeout(existing);
        }
        const timer = setTimeout(async () => {
            try {
                await handler();
            }
            finally {
                this.timers.delete(jobId);
            }
        }, delayMs);
        this.timers.set(jobId, timer);
    }
    cancel(jobId) {
        const timer = this.timers.get(jobId);
        if (timer) {
            clearTimeout(timer);
            this.timers.delete(jobId);
        }
    }
    cancelAll() {
        for (const timer of this.timers.values()) {
            clearTimeout(timer);
        }
        this.timers.clear();
    }
}
exports.DebouncedJobRunner = DebouncedJobRunner;
/**
 * Throttled execution
 */
class ThrottledExecutor {
    lastExecutionTime = new Map();
    async execute(jobId, handler, minIntervalMs = 1000) {
        const lastTime = this.lastExecutionTime.get(jobId) || 0;
        const now = Date.now();
        if (now - lastTime < minIntervalMs) {
            return;
        }
        try {
            await handler();
        }
        finally {
            this.lastExecutionTime.set(jobId, now);
        }
    }
    reset(jobId) {
        if (jobId) {
            this.lastExecutionTime.delete(jobId);
        }
        else {
            this.lastExecutionTime.clear();
        }
    }
}
exports.ThrottledExecutor = ThrottledExecutor;
//# sourceMappingURL=scheduler.js.map