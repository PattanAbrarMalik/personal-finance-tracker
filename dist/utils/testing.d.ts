/**
 * Advanced testing utilities and mocks
 */
export declare class MockApiClient {
    private responses;
    private callHistory;
    mockResponse(url: string, response: any): void;
    get(url: string): Promise<any>;
    post(url: string, data: any): Promise<any>;
    getCallHistory(): {
        method: string;
        url: string;
        data?: any;
    }[];
    getCallCount(url: string): number;
    reset(): void;
}
export declare class MockStorage {
    private store;
    setItem(key: string, value: string): void;
    getItem(key: string): string | null;
    removeItem(key: string): void;
    clear(): void;
    key(index: number): string | null;
    get length(): number;
}
/**
 * Test data builders
 */
export declare class TestDataBuilder {
    static user(overrides?: Record<string, any>): {
        id: string;
        email: string;
        name: string;
        password: string;
        twoFactorEnabled: boolean;
        createdAt: Date;
    };
    static transaction(overrides?: Record<string, any>): {
        id: string;
        userId: string;
        categoryId: string;
        amount: number;
        description: string;
        type: "expense";
        date: Date;
        isRecurring: boolean;
        tags: any[];
        createdAt: Date;
    };
    static category(overrides?: Record<string, any>): {
        id: string;
        userId: string;
        name: string;
        icon: string;
        color: string;
        createdAt: Date;
    };
    static budget(overrides?: Record<string, any>): {
        id: string;
        userId: string;
        categoryId: string;
        amount: number;
        period: "monthly";
        spent: number;
        status: "ok";
        createdAt: Date;
    };
    static goal(overrides?: Record<string, any>): {
        id: string;
        userId: string;
        name: string;
        targetAmount: number;
        currentAmount: number;
        deadline: Date;
        priority: "high";
        status: "active";
        createdAt: Date;
    };
}
/**
 * Assertion helpers
 */
export declare class Assert {
    static isTrue(condition: boolean, message: string): void;
    static isFalse(condition: boolean, message: string): void;
    static equal(actual: any, expected: any, message: string): void;
    static deepEqual(actual: any, expected: any, message: string): void;
    static throws(fn: () => void, message: string): void;
    static doesNotThrow(fn: () => void, message: string): void;
}
//# sourceMappingURL=testing.d.ts.map