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
export async function processBatch<T, R>(
  items: T[],
  processor: (batch: T[]) => Promise<R[]>,
  options: BatchOptions
): Promise<R[]> {
  const results: R[] = [];

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
export class Queue<T> {
  private items: T[] = [];

  enqueue(item: T): void {
    this.items.push(item);
  }

  dequeue(): T | undefined {
    return this.items.shift();
  }

  peek(): T | undefined {
    return this.items[0];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }

  clear(): void {
    this.items = [];
  }

  toArray(): T[] {
    return [...this.items];
  }
}

/**
 * Priority queue implementation
 */
export class PriorityQueue<T> {
  private items: Array<{ item: T; priority: number }> = [];

  enqueue(item: T, priority: number = 0): void {
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

  dequeue(): T | undefined {
    return this.items.shift()?.item;
  }

  peek(): T | undefined {
    return this.items[0]?.item;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }
}

/**
 * Circular buffer for fixed-size queues
 */
export class CircularBuffer<T> {
  private items: (T | undefined)[];
  private head = 0;
  private tail = 0;
  private size = 0;

  constructor(private capacity: number) {
    this.items = new Array(capacity);
  }

  push(item: T): void {
    if (this.size < this.capacity) {
      this.items[this.tail] = item;
      this.size++;
    } else {
      this.items[this.head] = item;
    }
    this.tail = (this.tail + 1) % this.capacity;
    if (this.size === this.capacity) {
      this.head = (this.head + 1) % this.capacity;
    }
  }

  pop(): T | undefined {
    if (this.size === 0) return undefined;

    const item = this.items[this.head];
    this.head = (this.head + 1) % this.capacity;
    this.size--;
    return item;
  }

  isFull(): boolean {
    return this.size === this.capacity;
  }

  isEmpty(): boolean {
    return this.size === 0;
  }

  getSize(): number {
    return this.size;
  }

  toArray(): T[] {
    const result: T[] = [];
    for (let i = 0; i < this.size; i++) {
      result.push(this.items[(this.head + i) % this.capacity]!);
    }
    return result;
  }
}

/**
 * Dedup operations
 */
export class Deduplicator<T> {
  private seen: Set<string> = new Set();
  private fn: (item: T) => string;

  constructor(hashFn?: (item: T) => string) {
    this.fn = hashFn || (item => JSON.stringify(item));
  }

  isDuplicate(item: T): boolean {
    const hash = this.fn(item);
    if (this.seen.has(hash)) {
      return true;
    }
    this.seen.add(hash);
    return false;
  }

  deduplicate(items: T[]): T[] {
    return items.filter(item => !this.isDuplicate(item));
  }

  clear(): void {
    this.seen.clear();
  }
}

/**
 * Accumulator for aggregating values
 */
export class Accumulator<T> {
  private value: T;

  constructor(initialValue: T) {
    this.value = initialValue;
  }

  accumulate(fn: (current: T, value: T) => T, newValue: T): T {
    this.value = fn(this.value, newValue);
    return this.value;
  }

  getValue(): T {
    return this.value;
  }

  reset(initialValue: T): void {
    this.value = initialValue;
  }
}
