import { TransactionType } from '@prisma/client';
export interface CreateTransactionData {
    amount: number;
    description: string;
    type: TransactionType;
    date: Date;
    categoryId?: string;
}
export interface UpdateTransactionData {
    amount?: number;
    description?: string;
    type?: TransactionType;
    date?: Date;
    categoryId?: string | null;
}
export interface TransactionFilters {
    type?: TransactionType;
    categoryId?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
}
/**
 * Get transactions for a user with optional filters
 */
export declare const getTransactions: (userId: string, filters?: TransactionFilters) => Promise<{
    transactions: ({
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
    })[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}>;
/**
 * Get a single transaction by ID
 */
export declare const getTransactionById: (transactionId: string, userId: string) => Promise<{
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
/**
 * Create a new transaction
 */
export declare const createTransaction: (userId: string, data: CreateTransactionData) => Promise<{
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
/**
 * Update a transaction
 */
export declare const updateTransaction: (transactionId: string, userId: string, data: UpdateTransactionData) => Promise<{
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
/**
 * Delete a transaction
 */
export declare const deleteTransaction: (transactionId: string, userId: string) => Promise<{
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
/**
 * Get transaction statistics for a user
 */
export declare const getTransactionStats: (userId: string, startDate?: Date, endDate?: Date) => Promise<{
    totalIncome: number;
    totalExpenses: number;
    balance: number;
    transactionCount: number;
}>;
//# sourceMappingURL=transaction.service.d.ts.map