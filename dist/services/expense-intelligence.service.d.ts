/**
 * Expense Prediction and ML-based insights
 */
export interface ExpensePrediction {
    category: string;
    predictedAmount: number;
    probability: number;
    timeframe: 'next-week' | 'next-month' | 'next-quarter';
}
export interface SpendingPattern {
    dayOfWeek: number;
    averageAmount: number;
    frequency: number;
}
export declare class ExpenseIntelligenceService {
    /**
     * Predict next expenses based on patterns
     */
    static predictNextExpenses(transactions: Array<{
        description: string;
        amount: number;
        date: Date;
        category: string;
    }>, daysAhead?: number): ExpensePrediction[];
    private static analyzePatterns;
    /**
     * Detect unusual spending patterns
     */
    static detectUnusualPatterns(transactions: Array<{
        amount: number;
        category: string;
        date: Date;
    }>): {
        category: string;
        anomalyScore: number;
    }[];
    /**
     * Get spending insights
     */
    static generateInsights(transactions: Array<{
        amount: number;
        category: string;
        date: Date;
    }>): string[];
}
//# sourceMappingURL=expense-intelligence.service.d.ts.map