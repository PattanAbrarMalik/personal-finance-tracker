/**
 * Batch operations and data processing utilities
 */
export interface BatchOptions {
    size: number;
    delayMs?: number;
}
/**
 * Process data in batches
 */
export declare function processBatch<T, R>(items: T[], processor: (batch: T[]) => Promise<R[]>, options: BatchOptions): Promise<R[]>;
/**
 * Queue implementation
 */
export declare class Queue<T> {
    private items;
    enqueue(item: T): void;
    dequeue(): T | undefined;
    peek(): T | undefined;
    isEmpty(): boolean;
    size(): number;
    clear(): void;
    toArray(): T[];
}
/**
 * Priority queue implementation
 */
export declare class PriorityQueue<T> {
    private items;
    enqueue(item: T, priority?: number): void;
    dequeue(): T | undefined;
    peek(): T | undefined;
    isEmpty(): boolean;
    size(): number;
}
/**
 * Circular buffer for fixed-size queues
 */
export declare class CircularBuffer<T> {
    private capacity;
    private items;
    private head;
    private tail;
    private size;
    constructor(capacity: number);
    push(item: T): void;
    pop(): T | undefined;
    isFull(): boolean;
    isEmpty(): boolean;
    getSize(): number;
    toArray(): T[];
}
/**
 * Dedup operations
 */
export declare class Deduplicator<T> {
    private seen;
    private fn;
    constructor(hashFn?: (item: T) => string);
    isDuplicate(item: T): boolean;
    deduplicate(items: T[]): T[];
    clear(): void;
}
/**
 * Accumulator for aggregating values
 */
export declare class Accumulator<T> {
    private value;
    constructor(initialValue: T);
    accumulate(fn: (current: T, value: T) => T, newValue: T): T;
    getValue(): T;
    reset(initialValue: T): void;
}
//# sourceMappingURL=data-structures.d.ts.map