/**
 * Transaction categorization and enrichment utilities
 */
export declare enum TransactionCategory {
    FOOD = "food",
    TRANSPORT = "transport",
    UTILITIES = "utilities",
    ENTERTAINMENT = "entertainment",
    SHOPPING = "shopping",
    HEALTH = "health",
    EDUCATION = "education",
    SUBSCRIPTION = "subscription",
    OTHER = "other"
}
/**
 * Smart categorization based on description
 */
export declare const categorizeTransaction: (description: string) => TransactionCategory;
/**
 * Detect recurring transactions
 */
export interface RecurringTransaction {
    description: string;
    frequency: 'daily' | 'weekly' | 'bi-weekly' | 'monthly' | 'yearly';
    estimatedAmount: number;
    confidence: number;
}
export declare const detectRecurringTransactions: (transactions: Array<{
    description: string;
    amount: number;
    date: Date;
}>) => RecurringTransaction[];
/**
 * Spending anomaly detection
 */
export interface SpendingAnomaly {
    date: Date;
    description: string;
    amount: number;
    expectedAmount: number;
    deviation: number;
}
export declare const detectAnomalies: (transactions: Array<{
    description: string;
    amount: number;
    date: Date;
}>, threshold?: number) => SpendingAnomaly[];
//# sourceMappingURL=transaction-intelligence.d.ts.map