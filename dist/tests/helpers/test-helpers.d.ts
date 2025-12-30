export interface TestUser {
    id: string;
    email: string;
    name: string | null;
    password: string;
    token: string;
}
/**
 * Create a test user and return user data with token
 */
export declare const createTestUser: (email?: string, password?: string, name?: string) => Promise<TestUser>;
/**
 * Create a test category
 */
export declare const createTestCategory: (userId: string, name?: string, color?: string) => Promise<{
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    color: string | null;
    icon: string | null;
    userId: string;
}>;
/**
 * Create a test transaction
 */
export declare const createTestTransaction: (userId: string, amount?: number, type?: "INCOME" | "EXPENSE", categoryId?: string) => Promise<{
    category: {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        color: string | null;
        icon: string | null;
        userId: string;
    };
} & {
    date: Date;
    type: string;
    id: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    amount: number;
    categoryId: string | null;
    userId: string;
}>;
//# sourceMappingURL=test-helpers.d.ts.map