/**
 * Advanced financial analytics service
 * Provides insights, trends, and forecasting
 */
export declare const analyticsService: {
    /**
     * Get spending trends (monthly comparison)
     */
    getSpendingTrends: (userId: string, months?: number) => Promise<{
        month: string;
        amount: number;
    }[]>;
    /**
     * Get category breakdown by percentage
     */
    getCategoryBreakdown: (userId: string) => Promise<{
        category: string;
        color: string;
        amount: number;
        percentage: number;
    }[]>;
    /**
     * Calculate savings rate
     */
    calculateSavingsRate: (userId: string, months?: number) => Promise<{
        income: number;
        expenses: number;
        savings: number;
        savingsRate: number;
    }>;
    /**
     * Get spending forecast (simple linear regression)
     */
    getSpendingForecast: (userId: string, months?: number) => Promise<any>;
    /**
     * Get budget vs actual comparison
     */
    getBudgetVsActual: (userId: string) => Promise<{
        category: string;
        budgeted: any;
        spent: number;
        remaining: number;
        percentage: number;
        status: string;
    }[]>;
    /**
     * Get top spending categories
     */
    getTopCategories: (userId: string, limit?: number) => Promise<{
        name: string;
        amount: number;
    }[]>;
    /**
     * Get financial health score (0-100)
     */
    getHealthScore: (userId: string) => Promise<number>;
};
//# sourceMappingURL=analytics.service.d.ts.map