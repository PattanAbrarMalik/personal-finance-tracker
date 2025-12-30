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

export class ExpenseIntelligenceService {
  /**
   * Predict next expenses based on patterns
   */
  static predictNextExpenses(
    transactions: Array<{ description: string; amount: number; date: Date; category: string }>,
    daysAhead: number = 30
  ): ExpensePrediction[] {
    const patterns = this.analyzePatterns(transactions);
    const predictions: ExpensePrediction[] = [];

    for (const [category, pattern] of patterns) {
      if (pattern.frequency > 0) {
        const probability = Math.min(pattern.frequency / 10, 1);
        const daysTillNext = pattern.dayOfWeek === new Date().getDay() ? 1 : 7;

        if (daysTillNext <= daysAhead) {
          predictions.push({
            category,
            predictedAmount: Math.round(pattern.averageAmount),
            probability,
            timeframe:
              daysAhead <= 7
                ? 'next-week'
                : daysAhead <= 30
                  ? 'next-month'
                  : 'next-quarter',
          });
        }
      }
    }

    return predictions.sort((a, b) => b.probability - a.probability);
  }

  private static analyzePatterns(
    transactions: Array<{ description: string; amount: number; date: Date; category: string }>
  ): Map<string, SpendingPattern> {
    const patterns = new Map<string, SpendingPattern>();

    for (const tx of transactions) {
      const dayOfWeek = tx.date.getDay();
      const key = tx.category;

      if (!patterns.has(key)) {
        patterns.set(key, { dayOfWeek, averageAmount: 0, frequency: 0 });
      }

      const pattern = patterns.get(key)!;
      pattern.averageAmount =
        (pattern.averageAmount * pattern.frequency + tx.amount) / (pattern.frequency + 1);
      pattern.frequency++;
    }

    return patterns;
  }

  /**
   * Detect unusual spending patterns
   */
  static detectUnusualPatterns(
    transactions: Array<{ amount: number; category: string; date: Date }>
  ): { category: string; anomalyScore: number }[] {
    const anomalies = [];

    const categoryStats = new Map<string, { amounts: number[]; avgAmount: number }>();

    for (const tx of transactions) {
      if (!categoryStats.has(tx.category)) {
        categoryStats.set(tx.category, { amounts: [], avgAmount: 0 });
      }
      const stats = categoryStats.get(tx.category)!;
      stats.amounts.push(tx.amount);
      stats.avgAmount =
        (stats.avgAmount * (stats.amounts.length - 1) + tx.amount) / stats.amounts.length;
    }

    for (const [category, stats] of categoryStats) {
      const variance =
        stats.amounts.reduce((sum, a) => sum + Math.pow(a - stats.avgAmount, 2), 0) /
        stats.amounts.length;
      const stdDev = Math.sqrt(variance);

      const lastTx = transactions.filter(t => t.category === category).pop();
      if (lastTx && Math.abs(lastTx.amount - stats.avgAmount) > 2 * stdDev) {
        anomalies.push({
          category,
          anomalyScore: Math.abs((lastTx.amount - stats.avgAmount) / stdDev),
        });
      }
    }

    return anomalies.sort((a, b) => b.anomalyScore - a.anomalyScore);
  }

  /**
   * Get spending insights
   */
  static generateInsights(
    transactions: Array<{ amount: number; category: string; date: Date }>
  ): string[] {
    const insights: string[] = [];
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const recentTxs = transactions.filter(t => t.date > thirtyDaysAgo);
    const totalSpent = recentTxs.reduce((sum, t) => sum + t.amount, 0);
    const dailyAverage = totalSpent / 30;

    insights.push(`Your daily average spending is $${dailyAverage.toFixed(2)}`);

    const categoryTotals = new Map<string, number>();
    for (const tx of recentTxs) {
      categoryTotals.set(tx.category, (categoryTotals.get(tx.category) || 0) + tx.amount);
    }

    const topCategory = Array.from(categoryTotals.entries()).sort((a, b) => b[1] - a[1])[0];
    if (topCategory) {
      insights.push(
        `${topCategory[0]} is your top spending category at $${topCategory[1].toFixed(2)}`
      );
    }

    return insights;
  }
}
