/**
 * Advanced testing utilities and mocks
 */

export class MockApiClient {
  private responses: Map<string, any> = new Map();
  private callHistory: Array<{ method: string; url: string; data?: any }> = [];

  mockResponse(url: string, response: any): void {
    this.responses.set(url, response);
  }

  async get(url: string): Promise<any> {
    this.callHistory.push({ method: 'GET', url });
    return this.responses.get(url) || { data: null };
  }

  async post(url: string, data: any): Promise<any> {
    this.callHistory.push({ method: 'POST', url, data });
    return this.responses.get(url) || { data: null };
  }

  getCallHistory() {
    return this.callHistory;
  }

  getCallCount(url: string): number {
    return this.callHistory.filter(call => call.url === url).length;
  }

  reset(): void {
    this.responses.clear();
    this.callHistory = [];
  }
}

export class MockStorage {
  private store: Map<string, string> = new Map();

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }

  getItem(key: string): string | null {
    return this.store.get(key) || null;
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  key(index: number): string | null {
    return Array.from(this.store.keys())[index] || null;
  }

  get length(): number {
    return this.store.size;
  }
}

/**
 * Test data builders
 */
export class TestDataBuilder {
  static user(overrides?: Record<string, any>) {
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

  static transaction(overrides?: Record<string, any>) {
    return {
      id: 'test-tx-1',
      userId: 'test-user-1',
      categoryId: 'test-cat-1',
      amount: 50.0,
      description: 'Test transaction',
      type: 'expense' as const,
      date: new Date(),
      isRecurring: false,
      tags: [],
      createdAt: new Date(),
      ...overrides,
    };
  }

  static category(overrides?: Record<string, any>) {
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

  static budget(overrides?: Record<string, any>) {
    return {
      id: 'test-budget-1',
      userId: 'test-user-1',
      categoryId: 'test-cat-1',
      amount: 500,
      period: 'monthly' as const,
      spent: 250,
      status: 'ok' as const,
      createdAt: new Date(),
      ...overrides,
    };
  }

  static goal(overrides?: Record<string, any>) {
    return {
      id: 'test-goal-1',
      userId: 'test-user-1',
      name: 'Emergency Fund',
      targetAmount: 5000,
      currentAmount: 1000,
      deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      priority: 'high' as const,
      status: 'active' as const,
      createdAt: new Date(),
      ...overrides,
    };
  }
}

/**
 * Assertion helpers
 */
export class Assert {
  static isTrue(condition: boolean, message: string): void {
    if (!condition) throw new Error(`Assertion failed: ${message}`);
  }

  static isFalse(condition: boolean, message: string): void {
    if (condition) throw new Error(`Assertion failed: ${message}`);
  }

  static equal(actual: any, expected: any, message: string): void {
    if (actual !== expected) {
      throw new Error(
        `Assertion failed: ${message}. Expected ${expected}, got ${actual}`
      );
    }
  }

  static deepEqual(actual: any, expected: any, message: string): void {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      throw new Error(
        `Assertion failed: ${message}. Expected ${JSON.stringify(
          expected
        )}, got ${JSON.stringify(actual)}`
      );
    }
  }

  static throws(fn: () => void, message: string): void {
    try {
      fn();
      throw new Error(`Assertion failed: ${message}. Expected function to throw.`);
    } catch (e) {
      // Expected
    }
  }

  static doesNotThrow(fn: () => void, message: string): void {
    try {
      fn();
    } catch (e) {
      throw new Error(
        `Assertion failed: ${message}. Expected function not to throw: ${e}`
      );
    }
  }
}
