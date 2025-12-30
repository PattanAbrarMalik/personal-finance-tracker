"use strict";
/**
 * Advanced testing utilities and mocks
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Assert = exports.TestDataBuilder = exports.MockStorage = exports.MockApiClient = void 0;
class MockApiClient {
    responses = new Map();
    callHistory = [];
    mockResponse(url, response) {
        this.responses.set(url, response);
    }
    async get(url) {
        this.callHistory.push({ method: 'GET', url });
        return this.responses.get(url) || { data: null };
    }
    async post(url, data) {
        this.callHistory.push({ method: 'POST', url, data });
        return this.responses.get(url) || { data: null };
    }
    getCallHistory() {
        return this.callHistory;
    }
    getCallCount(url) {
        return this.callHistory.filter(call => call.url === url).length;
    }
    reset() {
        this.responses.clear();
        this.callHistory = [];
    }
}
exports.MockApiClient = MockApiClient;
class MockStorage {
    store = new Map();
    setItem(key, value) {
        this.store.set(key, value);
    }
    getItem(key) {
        return this.store.get(key) || null;
    }
    removeItem(key) {
        this.store.delete(key);
    }
    clear() {
        this.store.clear();
    }
    key(index) {
        return Array.from(this.store.keys())[index] || null;
    }
    get length() {
        return this.store.size;
    }
}
exports.MockStorage = MockStorage;
/**
 * Test data builders
 */
class TestDataBuilder {
    static user(overrides) {
        return {
            id: 'test-user-1',
            email: 'test@example.com',
            name: 'Test User',
            password: 'hashedPassword123',
            twoFactorEnabled: false,
            createdAt: new Date(),
            ...overrides,
        };
    }
    static transaction(overrides) {
        return {
            id: 'test-tx-1',
            userId: 'test-user-1',
            categoryId: 'test-cat-1',
            amount: 50.0,
            description: 'Test transaction',
            type: 'expense',
            date: new Date(),
            isRecurring: false,
            tags: [],
            createdAt: new Date(),
            ...overrides,
        };
    }
    static category(overrides) {
        return {
            id: 'test-cat-1',
            userId: 'test-user-1',
            name: 'Food',
            icon: '🍔',
            color: '#FF6B6B',
            createdAt: new Date(),
            ...overrides,
        };
    }
    static budget(overrides) {
        return {
            id: 'test-budget-1',
            userId: 'test-user-1',
            categoryId: 'test-cat-1',
            amount: 500,
            period: 'monthly',
            spent: 250,
            status: 'ok',
            createdAt: new Date(),
            ...overrides,
        };
    }
    static goal(overrides) {
        return {
            id: 'test-goal-1',
            userId: 'test-user-1',
            name: 'Emergency Fund',
            targetAmount: 5000,
            currentAmount: 1000,
            deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            priority: 'high',
            status: 'active',
            createdAt: new Date(),
            ...overrides,
        };
    }
}
exports.TestDataBuilder = TestDataBuilder;
/**
 * Assertion helpers
 */
class Assert {
    static isTrue(condition, message) {
        if (!condition)
            throw new Error(`Assertion failed: ${message}`);
    }
    static isFalse(condition, message) {
        if (condition)
            throw new Error(`Assertion failed: ${message}`);
    }
    static equal(actual, expected, message) {
        if (actual !== expected) {
            throw new Error(`Assertion failed: ${message}. Expected ${expected}, got ${actual}`);
        }
    }
    static deepEqual(actual, expected, message) {
        if (JSON.stringify(actual) !== JSON.stringify(expected)) {
            throw new Error(`Assertion failed: ${message}. Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
        }
    }
    static throws(fn, message) {
        try {
            fn();
            throw new Error(`Assertion failed: ${message}. Expected function to throw.`);
        }
        catch (e) {
            // Expected
        }
    }
    static doesNotThrow(fn, message) {
        try {
            fn();
        }
        catch (e) {
            throw new Error(`Assertion failed: ${message}. Expected function not to throw: ${e}`);
        }
    }
}
exports.Assert = Assert;
//# sourceMappingURL=testing.js.map