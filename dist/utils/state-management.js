"use strict";
/**
 * Advanced state management with Redux-like patterns
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromisePool = exports.CacheManager = exports.MiddlewareChain = exports.EventBus = exports.Store = void 0;
class Store {
    state;
    listeners = new Set();
    history = [];
    historyIndex = -1;
    constructor(initialState) {
        this.state = initialState;
        this.history.push(structuredClone(initialState));
        this.historyIndex = 0;
    }
    getState() {
        return this.state;
    }
    setState(newState) {
        this.state = {
            ...this.state,
            ...newState,
        };
        this.history.push(structuredClone(this.state));
        this.historyIndex = this.history.length - 1;
        this.notifyListeners();
    }
    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }
    notifyListeners() {
        this.listeners.forEach(listener => listener(this.state));
    }
    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.state = structuredClone(this.history[this.historyIndex]);
            this.notifyListeners();
        }
    }
    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.state = structuredClone(this.history[this.historyIndex]);
            this.notifyListeners();
        }
    }
    canUndo() {
        return this.historyIndex > 0;
    }
    canRedo() {
        return this.historyIndex < this.history.length - 1;
    }
}
exports.Store = Store;
/**
 * Simple event bus for component communication
 */
class EventBus {
    events = new Map();
    on(event, handler) {
        if (!this.events.has(event)) {
            this.events.set(event, new Set());
        }
        this.events.get(event).add(handler);
        return () => this.events.get(event).delete(handler);
    }
    once(event, handler) {
        const wrapper = (...args) => {
            handler(...args);
            this.off(event, wrapper);
        };
        this.on(event, wrapper);
    }
    off(event, handler) {
        this.events.get(event)?.delete(handler);
    }
    emit(event, ...args) {
        this.events.get(event)?.forEach(handler => handler(...args));
    }
    clear(event) {
        if (event) {
            this.events.delete(event);
        }
        else {
            this.events.clear();
        }
    }
}
exports.EventBus = EventBus;
class MiddlewareChain {
    middlewares = [];
    use(middleware) {
        this.middlewares.push(middleware);
        return this;
    }
    async execute(data) {
        let result = data;
        for (const middleware of this.middlewares) {
            result = await middleware(result);
        }
        return result;
    }
}
exports.MiddlewareChain = MiddlewareChain;
/**
 * Cache with TTL support
 */
class CacheManager {
    cache = new Map();
    set(key, value, ttl = 3600000) {
        this.cache.set(key, {
            data: value,
            expiry: Date.now() + ttl,
        });
    }
    get(key) {
        const item = this.cache.get(key);
        if (!item)
            return null;
        if (Date.now() > item.expiry) {
            this.cache.delete(key);
            return null;
        }
        return item.data;
    }
    has(key) {
        return this.get(key) !== null;
    }
    delete(key) {
        this.cache.delete(key);
    }
    clear() {
        this.cache.clear();
    }
    keys() {
        return Array.from(this.cache.keys());
    }
}
exports.CacheManager = CacheManager;
/**
 * Promise pooling for concurrent operations
 */
class PromisePool {
    concurrency;
    constructor(concurrency = 5) {
        this.concurrency = concurrency;
    }
    async run(tasks) {
        const results = [];
        const executing = [];
        for (const task of tasks) {
            const promise = task().then(result => {
                results.push(result);
            });
            executing.push(promise);
            if (executing.length >= this.concurrency) {
                await Promise.race(executing);
                executing.splice(executing.findIndex(p => p === promise), 1);
            }
        }
        await Promise.all(executing);
        return results;
    }
}
exports.PromisePool = PromisePool;
//# sourceMappingURL=state-management.js.map