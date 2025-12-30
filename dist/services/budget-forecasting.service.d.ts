/**
 * Advanced Budget Forecasting Service
 */
export interface BudgetForecast {
    month: string;
    predictedExpense: number;
    confidence: number;
    trend: 'increasing' | 'decreasing' | 'stable';
    recommendation: string;
}
export declare class BudgetForecastingService {
    /**
     * Forecast next 3 months of spending
     */
    static forecastSpending(historicalData: Array<{
        date: Date;
        amount: number;
    }>, months?: number): BudgetForecast[];
    private static calculateMonthlyAverages;
    private static calculateTrend;
    private static getRecommendation;
    /**
     * Adjust budget based on forecast
     */
    static adjustBudgetRecommendation(currentBudget: number, forecast: BudgetForecast[]): number;
}
//# sourceMappingURL=budget-forecasting.service.d.ts.map