"use strict";
/**
 * Advanced Budget Forecasting Service
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetForecastingService = void 0;
class BudgetForecastingService {
    /**
     * Forecast next 3 months of spending
     */
    static forecastSpending(historicalData, months = 3) {
        const sortedData = historicalData.sort((a, b) => a.date.getTime() - b.date.getTime());
        const forecasts = [];
        // Calculate average monthly spending
        const monthlyAverages = this.calculateMonthlyAverages(sortedData);
        const avgAmount = monthlyAverages.reduce((a, b) => a + b, 0) / monthlyAverages.length;
        // Calculate trend
        const trend = this.calculateTrend(monthlyAverages);
        // Generate forecasts
        for (let i = 1; i <= months; i++) {
            const forecastedAmount = avgAmount * (1 + trend * (i * 0.05));
            const confidence = Math.max(0.6, 1 - i * 0.1);
            forecasts.push({
                month: new Date(Date.now() + i * 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 7),
                predictedExpense: Math.round(forecastedAmount),
                confidence,
                trend: trend > 0.02 ? 'increasing' : trend < -0.02 ? 'decreasing' : 'stable',
                recommendation: this.getRecommendation(forecastedAmount, avgAmount),
            });
        }
        return forecasts;
    }
    static calculateMonthlyAverages(data) {
        const monthlyMap = new Map();
        for (const item of data) {
            const month = item.date.toISOString().slice(0, 7);
            if (!monthlyMap.has(month))
                monthlyMap.set(month, []);
            monthlyMap.get(month).push(item.amount);
        }
        return Array.from(monthlyMap.values()).map(amounts => amounts.reduce((a, b) => a + b, 0) / amounts.length);
    }
    static calculateTrend(values) {
        if (values.length < 2)
            return 0;
        const recent = values.slice(-3);
        const older = values.slice(0, 3);
        const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
        const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
        return (recentAvg - olderAvg) / olderAvg;
    }
    static getRecommendation(forecast, average) {
        const increase = ((forecast - average) / average) * 100;
        if (increase > 20)
            return 'Consider reducing spending next month';
        if (increase < -20)
            return 'You may have budget surplus';
        return 'Spending is on track';
    }
    /**
     * Adjust budget based on forecast
     */
    static adjustBudgetRecommendation(currentBudget, forecast) {
        const avgForecast = forecast.reduce((sum, f) => sum + f.predictedExpense, 0) / forecast.length;
        return Math.round(avgForecast * 1.1); // 10% buffer
    }
}
exports.BudgetForecastingService = BudgetForecastingService;
//# sourceMappingURL=budget-forecasting.service.js.map