"use strict";
/**
 * Batch operations and data processing utilities
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Accumulator = exports.Deduplicator = exports.CircularBuffer = exports.PriorityQueue = exports.Queue = void 0;
exports.processBatch = processBatch;
/**
 * Process data in batches
 */
async function processBatch(items, processor, options) {
    const results = [];
    for (let i = 0; i < items.length; i += options.size) {
        const batch = items.slice(i, i + options.size);
        const batchResults = await processor(batch);
        results.push(...batchResults);
        if (options.delayMs && i + options.size < items.length) {
            await new Promise(resolve => setTimeout(resolve, options.delayMs));
        }
    }
    return results;
}
/**
 * Queue implementation
 */
class Queue {
    items = [];
    enqueue(item) {
        this.items.push(item);
    }
    dequeue() {
        return this.items.shift();
    }
    peek() {
        return this.items[0];
    }
    isEmpty() {
        return this.items.length === 0;
    }
    size() {
        return this.items.length;
    }
    clear() {
        this.items = [];
    }
    toArray() {
        return [...this.items];
    }
}
exports.Queue = Queue;
/**
 * Priority queue implementation
 */
class PriorityQueue {
    items = [];
    enqueue(item, priority = 0) {
        const entry = { item, priority };
        let added = false;
        for (let i = 0; i < this.items.length; i++) {
            if (priority > this.items[i].priority) {
                this.items.splice(i, 0, entry);
                added = true;
                break;
            }
        }
        if (!added) {
            this.items.push(entry);
        }
    }
    dequeue() {
        return this.items.shift()?.item;
    }
    peek() {
        return this.items[0]?.item;
    }
    isEmpty() {
        return this.items.length === 0;
    }
    size() {
        return this.items.length;
    }
}
exports.PriorityQueue = PriorityQueue;
/**
 * Circular buffer for fixed-size queues
 */
class CircularBuffer {
    capacity;
    items;
    head = 0;
    tail = 0;
    size = 0;
    constructor(capacity) {
        this.capacity = capacity;
        this.items = new Array(capacity);
    }
    push(item) {
        if (this.size < this.capacity) {
            this.items[this.tail] = item;
            this.size++;
        }
        else {
            this.items[this.head] = item;
        }
        this.tail = (this.tail + 1) % this.capacity;
        if (this.size === this.capacity) {
            this.head = (this.head + 1) % this.capacity;
        }
    }
    pop() {
        if (this.size === 0)
            return undefined;
        const item = this.items[this.head];
        this.head = (this.head + 1) % this.capacity;
        this.size--;
        return item;
    }
    isFull() {
        return this.size === this.capacity;
    }
    isEmpty() {
        return this.size === 0;
    }
    getSize() {
        return this.size;
    }
    toArray() {
        const result = [];
        for (let i = 0; i < this.size; i++) {
            result.push(this.items[(this.head + i) % this.capacity]);
        }
        return result;
    }
}
exports.CircularBuffer = CircularBuffer;
/**
 * Dedup operations
 */
class Deduplicator {
    seen = new Set();
    fn;
    constructor(hashFn) {
        this.fn = hashFn || (item => JSON.stringify(item));
    }
    isDuplicate(item) {
        const hash = this.fn(item);
        if (this.seen.has(hash)) {
            return true;
        }
        this.seen.add(hash);
        return false;
    }
    deduplicate(items) {
        return items.filter(item => !this.isDuplicate(item));
    }
    clear() {
        this.seen.clear();
    }
}
exports.Deduplicator = Deduplicator;
/**
 * Accumulator for aggregating values
 */
class Accumulator {
    value;
    constructor(initialValue) {
        this.value = initialValue;
    }
    accumulate(fn, newValue) {
        this.value = fn(this.value, newValue);
        return this.value;
    }
    getValue() {
        return this.value;
    }
    reset(initialValue) {
        this.value = initialValue;
    }
}
exports.Accumulator = Accumulator;
//# sourceMappingURL=data-structures.js.map