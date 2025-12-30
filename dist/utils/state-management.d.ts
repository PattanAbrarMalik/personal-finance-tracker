/**
 * Advanced state management with Redux-like patterns
 */
type Listener<T> = (state: T) => void;
export declare class Store<T> {
    private state;
    private listeners;
    private history;
    private historyIndex;
    constructor(initialState: T);
    getState(): T;
    setState(newState: Partial<T> | T): void;
    subscribe(listener: Listener<T>): () => void;
    private notifyListeners;
    undo(): void;
    redo(): void;
    canUndo(): boolean;
    canRedo(): boolean;
}
/**
 * Simple event bus for component communication
 */
export declare class EventBus {
    private events;
    on(event: string, handler: (...args: any[]) => void): () => void;
    once(event: string, handler: (...args: any[]) => void): void;
    off(event: string, handler: (...args: any[]) => void): void;
    emit(event: string, ...args: any[]): void;
    clear(event?: string): void;
}
/**
 * Middleware system for request intercepting
 */
export type Middleware<T> = (data: T) => Promise<T>;
export declare class MiddlewareChain<T> {
    private middlewares;
    use(middleware: Middleware<T>): this;
    execute(data: T): Promise<T>;
}
/**
 * Cache with TTL support
 */
export declare class CacheManager<T> {
    private cache;
    set(key: string, value: T, ttl?: number): void;
    get(key: string): T | null;
    has(key: string): boolean;
    delete(key: string): void;
    clear(): void;
    keys(): string[];
}
/**
 * Promise pooling for concurrent operations
 */
export declare class PromisePool {
    private concurrency;
    constructor(concurrency?: number);
    run<T>(tasks: Array<() => Promise<T>>): Promise<T[]>;
}
export {};
//# sourceMappingURL=state-management.d.ts.map