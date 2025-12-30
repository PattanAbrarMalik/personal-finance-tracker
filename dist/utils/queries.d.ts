/**
 * Advanced Prisma query utilities
 * Reusable queries for common operations
 */
export declare const queries: {
    /**
     * Get user with all relations
     */
    getUserWithRelations: (userId: string) => import(".prisma/client").Prisma.Prisma__UserClient<{
        transactions: {
            date: Date;
            type: string;
            id: string;
            description: string;
            createdAt: Date;
            updatedAt: Date;
            amount: number;
            categoryId: string | null;
            userId: string;
        }[];
        categories: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            color: string | null;
            icon: string | null;
            userId: string;
        }[];
        budgets: ({
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
        })[];
        savingsGoals: {
            id: string;
            description: string | null;
            category: string | null;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            color: string | null;
            icon: string | null;
            userId: string;
            targetAmount: number;
            currentAmount: number;
            deadline: Date | null;
            priority: string | null;
        }[];
    } & {
        id: string;
        email: string;
        name: string | null;
        password: string;
        twoFactorEnabled: boolean;
        twoFactorSecret: string | null;
        twoFactorBackupCodes: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, null, import("@prisma/client/runtime/library").DefaultArgs>;
    /**
     * Get transactions with filters and pagination
     */
    getTransactionsFiltered: (userId: string, options: {
        skip: number;
        take: number;
        categoryId?: string;
        type?: "income" | "expense";
        startDate?: Date;
        endDate?: Date;
    }) => import(".prisma/client").Prisma.PrismaPromise<({
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
    })[]>;
    /**
     * Count transactions with filters
     */
    countTransactionsFiltered: (userId: string, options: {
        categoryId?: string;
        type?: "income" | "expense";
        startDate?: Date;
        endDate?: Date;
    }) => import(".prisma/client").Prisma.PrismaPromise<number>;
    /**
     * Get monthly summary
     */
    getMonthlySummary: (userId: string, year: number, month: number) => import(".prisma/client").Prisma.GetTransactionGroupByPayload<{
        by: "type"[];
        where: {
            userId: string;
            createdAt: {
                gte: Date;
                lte: Date;
            };
        };
        _sum: {
            amount: true;
        };
        _count: {
            id: true;
        };
    }>;
    /**
     * Get upcoming bills (next 30 days)
     */
    getUpcomingBills: (userId: string) => import(".prisma/client").Prisma.PrismaPromise<{
        date: Date;
        type: string;
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        amount: number;
        categoryId: string | null;
        userId: string;
    }[]>;
    /**
     * Get budget status
     */
    getBudgetStatus: (budgetId: string) => import(".prisma/client").Prisma.Prisma__BudgetClient<{
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
    }, null, import("@prisma/client/runtime/library").DefaultArgs>;
    /**
     * Get savings goals progress
     */
    getSavingsGoalProgress: (userId: string) => import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        createdAt: Date;
        targetAmount: number;
        currentAmount: number;
        deadline: Date;
    }[]>;
    /**
     * Archive old transactions (older than 1 year)
     */
    archiveOldTransactions: (userId: string) => import(".prisma/client").Prisma.PrismaPromise<import(".prisma/client").Prisma.BatchPayload>;
};
//# sourceMappingURL=queries.d.ts.map