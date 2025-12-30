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

export class JobQueue {
  private jobs: Map<string, Job> = new Map();
  private queue: string[] = [];
  private running = false;
  private maxConcurrent = 1;
  private activeJobs = 0;

  addJob<T>(name: string, handler: () => Promise<T>): string {
    const id = Math.random().toString(36).substring(7);
    const job: Job<T> = {
      id,
      name,
      handler,
      status: 'pending',
      createdAt: new Date(),
    };
    this.jobs.set(id, job as Job);
    this.queue.push(id);
    return id;
  }

  async start(): Promise<void> {
    if (this.running) return;
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

  private async executeJob(jobId: string): Promise<void> {
    const job = this.jobs.get(jobId);
    if (!job) return;

    job.status = 'running';
    job.startedAt = new Date();
    this.activeJobs++;

    try {
      job.result = await job.handler();
      job.status = 'completed';
    } catch (error) {
      job.status = 'failed';
      job.error = error as Error;
    } finally {
      job.completedAt = new Date();
      this.activeJobs--;
    }
  }

  getJob(id: string): Job | undefined {
    return this.jobs.get(id);
  }

  stop(): void {
    this.running = false;
  }

  clear(): void {
    this.jobs.clear();
    this.queue = [];
  }
}

/**
 * Scheduler for recurring tasks
 */
export class TaskScheduler {
  private tasks: Map<string, { interval: NodeJS.Timer; handler: () => Promise<void> }> =
    new Map();

  scheduleInterval(taskId: string, intervalMs: number, handler: () => Promise<void>): void {
    const interval = setInterval(async () => {
      try {
        await handler();
      } catch (error) {
        console.error(`Task ${taskId} failed:`, error);
      }
    }, intervalMs);

    this.tasks.set(taskId, { interval, handler });
  }

  scheduleCron(taskId: string, cronExpression: string, handler: () => Promise<void>): void {
    // Simple cron: "0 * * * *" = every hour at minute 0
    // This is a simplified implementation
    const parts = cronExpression.split(' ');
    const [minute, hour] = parts;

    const checkAndRun = async () => {
      const now = new Date();
      const shouldRun =
        (minute === '*' || parseInt(minute) === now.getMinutes()) &&
        (hour === '*' || parseInt(hour) === now.getHours());

      if (shouldRun) {
        try {
          await handler();
        } catch (error) {
          console.error(`Task ${taskId} failed:`, error);
        }
      }
    };

    const interval = setInterval(checkAndRun, 60000); // Check every minute
    this.tasks.set(taskId, { interval, handler });
  }

  stopTask(taskId: string): void {
    const task = this.tasks.get(taskId);
    if (task) {
      clearInterval(task.interval);
      this.tasks.delete(taskId);
    }
  }

  stopAll(): void {
    for (const [, task] of this.tasks) {
      clearInterval(task.interval);
    }
    this.tasks.clear();
  }
}

/**
 * Debounced job execution
 */
export class DebouncedJobRunner {
  private timers: Map<string, NodeJS.Timer> = new Map();

  run(jobId: string, handler: () => Promise<void>, delayMs: number = 1000): void {
    const existing = this.timers.get(jobId);
    if (existing) {
      clearTimeout(existing);
    }

    const timer = setTimeout(async () => {
      try {
        await handler();
      } finally {
        this.timers.delete(jobId);
      }
    }, delayMs);

    this.timers.set(jobId, timer);
  }

  cancel(jobId: string): void {
    const timer = this.timers.get(jobId);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(jobId);
    }
  }

  cancelAll(): void {
    for (const timer of this.timers.values()) {
      clearTimeout(timer);
    }
    this.timers.clear();
  }
}

/**
 * Throttled execution
 */
export class ThrottledExecutor {
  private lastExecutionTime: Map<string, number> = new Map();

  async execute(jobId: string, handler: () => Promise<void>, minIntervalMs: number = 1000): Promise<void> {
    const lastTime = this.lastExecutionTime.get(jobId) || 0;
    const now = Date.now();

    if (now - lastTime < minIntervalMs) {
      return;
    }

    try {
      await handler();
    } finally {
      this.lastExecutionTime.set(jobId, now);
    }
  }

  reset(jobId?: string): void {
    if (jobId) {
      this.lastExecutionTime.delete(jobId);
    } else {
      this.lastExecutionTime.clear();
    }
  }
}
