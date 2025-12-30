/**
 * Advanced state management with Redux-like patterns
 */

type Listener<T> = (state: T) => void;

export class Store<T> {
  private state: T;
  private listeners: Set<Listener<T>> = new Set();
  private history: T[] = [];
  private historyIndex: number = -1;

  constructor(initialState: T) {
    this.state = initialState;
    this.history.push(structuredClone(initialState));
    this.historyIndex = 0;
  }

  getState(): T {
    return this.state;
  }

  setState(newState: Partial<T> | T): void {
    this.state = {
      ...this.state,
      ...newState,
    };
    this.history.push(structuredClone(this.state));
    this.historyIndex = this.history.length - 1;
    this.notifyListeners();
  }

  subscribe(listener: Listener<T>): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.state));
  }

  undo(): void {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.state = structuredClone(this.history[this.historyIndex]);
      this.notifyListeners();
    }
  }

  redo(): void {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this.state = structuredClone(this.history[this.historyIndex]);
      this.notifyListeners();
    }
  }

  canUndo(): boolean {
    return this.historyIndex > 0;
  }

  canRedo(): boolean {
    return this.historyIndex < this.history.length - 1;
  }
}

/**
 * Simple event bus for component communication
 */
export class EventBus {
  private events: Map<string, Set<(...args: any[]) => void>> = new Map();

  on(event: string, handler: (...args: any[]) => void): () => void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event)!.add(handler);

    return () => this.events.get(event)!.delete(handler);
  }

  once(event: string, handler: (...args: any[]) => void): void {
    const wrapper = (...args: any[]) => {
      handler(...args);
      this.off(event, wrapper);
    };
    this.on(event, wrapper);
  }

  off(event: string, handler: (...args: any[]) => void): void {
    this.events.get(event)?.delete(handler);
  }

  emit(event: string, ...args: any[]): void {
    this.events.get(event)?.forEach(handler => handler(...args));
  }

  clear(event?: string): void {
    if (event) {
      this.events.delete(event);
    } else {
      this.events.clear();
    }
  }
}

/**
 * Middleware system for request intercepting
 */
export type Middleware<T> = (data: T) => Promise<T>;

export class MiddlewareChain<T> {
  private middlewares: Middleware<T>[] = [];

  use(middleware: Middleware<T>): this {
    this.middlewares.push(middleware);
    return this;
  }

  async execute(data: T): Promise<T> {
    let result = data;
    for (const middleware of this.middlewares) {
      result = await middleware(result);
    }
    return result;
  }
}

/**
 * Cache with TTL support
 */
export class CacheManager<T> {
  private cache: Map<string, { data: T; expiry: number }> = new Map();

  set(key: string, value: T, ttl: number = 3600000): void {
    this.cache.set(key, {
      data: value,
      expiry: Date.now() + ttl,
    });
  }

  get(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  keys(): string[] {
    return Array.from(this.cache.keys());
  }
}

/**
 * Promise pooling for concurrent operations
 */
export class PromisePool {
  constructor(private concurrency: number = 5) {}

  async run<T>(tasks: Array<() => Promise<T>>): Promise<T[]> {
    const results: T[] = [];
    const executing: Promise<void>[] = [];

    for (const task of tasks) {
      const promise = task().then(result => {
        results.push(result);
      });

      executing.push(promise);

      if (executing.length >= this.concurrency) {
        await Promise.race(executing);
        executing.splice(
          executing.findIndex(p => p === promise),
          1
        );
      }
    }

    await Promise.all(executing);
    return results;
  }
}
