import { BudgetPeriod } from '@prisma/client';
export interface CreateBudgetData {
    name: string;
    amount: number;
    period: BudgetPeriod;
    categoryId?: string;
    startDate: Date;
    endDate?: Date;
}
export interface UpdateBudgetData {
    name?: string;
    amount?: number;
    period?: BudgetPeriod;
    categoryId?: string | null;
    startDate?: Date;
    endDate?: Date | null;
}
/**
 * Get all budgets for a user
 */
export declare const getBudgets: (userId: string) => Promise<({
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
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    amount: number;
    categoryId: string | null;
    startDate: Date;
    endDate: Date | null;
    period: string;
    userId: string;
})[]>;
/**
 * Get a single budget by ID
 */
export declare const getBudgetById: (budgetId: string, userId: string) => Promise<{
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
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    amount: number;
    categoryId: string | null;
    startDate: Date;
    endDate: Date | null;
    period: string;
    userId: string;
}>;
/**
 * Create a new budget
 */
export declare const createBudget: (userId: string, data: CreateBudgetData) => Promise<{
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
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    amount: number;
    categoryId: string | null;
    startDate: Date;
    endDate: Date | null;
    period: string;
    userId: string;
}>;
/**
 * Update a budget
 */
export declare const updateBudget: (budgetId: string, userId: string, data: UpdateBudgetData) => Promise<{
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
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    amount: number;
    categoryId: string | null;
    startDate: Date;
    endDate: Date | null;
    period: string;
    userId: string;
}>;
/**
 * Delete a budget
 */
export declare const deleteBudget: (budgetId: string, userId: string) => Promise<{
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    amount: number;
    categoryId: string | null;
    startDate: Date;
    endDate: Date | null;
    period: string;
    userId: string;
}>;
/**
 * Get budget progress (spent vs budgeted)
 */
export declare const getBudgetProgress: (budgetId: string, userId: string) => Promise<{
    budget: {
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
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        amount: number;
        categoryId: string | null;
        startDate: Date;
        endDate: Date | null;
        period: string;
        userId: string;
    };
    spent: number;
    remaining: number;
    percentage: number;
    isExceeded: boolean;
}>;
//# sourceMappingURL=budget.service.d.ts.map