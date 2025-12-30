/**
 * Transaction categorization and enrichment utilities
 */

export enum TransactionCategory {
  FOOD = 'food',
  TRANSPORT = 'transport',
  UTILITIES = 'utilities',
  ENTERTAINMENT = 'entertainment',
  SHOPPING = 'shopping',
  HEALTH = 'health',
  EDUCATION = 'education',
  SUBSCRIPTION = 'subscription',
  OTHER = 'other',
}

/**
 * Smart categorization based on description
 */
export const categorizeTransaction = (
  description: string
): TransactionCategory => {
  const lower = description.toLowerCase();

  const categoryPatterns: Record<TransactionCategory, RegExp[]> = {
    [TransactionCategory.FOOD]: [/restaurant|cafe|pizza|burger|grocery|food|bakery/],
    [TransactionCategory.TRANSPORT]: [/uber|taxi|gas|fuel|parking|metro|transit|transport/],
    [TransactionCategory.UTILITIES]: [/electric|water|internet|phone|gas|utility/],
    [TransactionCategory.ENTERTAINMENT]: [/movie|cinema|game|concert|music|spotify|netflix/],
    [TransactionCategory.SHOPPING]: [/amazon|mall|store|shop|ebay|retail/],
    [TransactionCategory.HEALTH]: [/doctor|hospital|pharmacy|medicine|health|gym|fitness/],
    [TransactionCategory.EDUCATION]: [/school|course|book|learning|tuition|training/],
    [TransactionCategory.SUBSCRIPTION]: [/subscription|monthly|annual|premium|member/],
    [TransactionCategory.OTHER]: [/transfer|payment|misc|other/],
  };

  for (const [category, patterns] of Object.entries(categoryPatterns)) {
    for (const pattern of patterns) {
      if (pattern.test(lower)) {
        return category as TransactionCategory;
      }
    }
  }

  return TransactionCategory.OTHER;
};

/**
 * Detect recurring transactions
 */
export interface RecurringTransaction {
  description: string;
  frequency: 'daily' | 'weekly' | 'bi-weekly' | 'monthly' | 'yearly';
  estimatedAmount: number;
  confidence: number;
}

export const detectRecurringTransactions = (
  transactions: Array<{ description: string; amount: number; date: Date }>
): RecurringTransaction[] => {
  const groups = new Map<string, Array<{ amount: number; date: Date }>>();

  // Group by description
  for (const tx of transactions) {
    const key = tx.description;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push({ amount: tx.amount, date: tx.date });
  }

  const recurring: RecurringTransaction[] = [];

  for (const [desc, txs] of groups) {
    if (txs.length < 2) continue;

    txs.sort((a, b) => a.date.getTime() - b.date.getTime());

    // Calculate intervals
    const intervals: number[] = [];
    for (let i = 1; i < txs.length; i++) {
      intervals.push(
        Math.floor((txs[i].date.getTime() - txs[i - 1].date.getTime()) / (24 * 60 * 60 * 1000))
      );
    }

    if (intervals.length === 0) continue;

    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    let frequency: RecurringTransaction['frequency'] = 'monthly';

    if (avgInterval < 2) frequency = 'daily';
    else if (avgInterval < 10) frequency = 'weekly';
    else if (avgInterval < 20) frequency = 'bi-weekly';
    else if (avgInterval < 60) frequency = 'monthly';
    else frequency = 'yearly';

    const avgAmount = txs.reduce((sum, t) => sum + t.amount, 0) / txs.length;

    recurring.push({
      description: desc,
      frequency,
      estimatedAmount: avgAmount,
      confidence: Math.min(txs.length / 10, 1),
    });
  }

  return recurring.filter(r => r.confidence > 0.5);
};

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

export const detectAnomalies = (
  transactions: Array<{ description: string; amount: number; date: Date }>,
  threshold: number = 2 // Standard deviations
): SpendingAnomaly[] => {
  const groups = new Map<string, number[]>();

  for (const tx of transactions) {
    const key = tx.description;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(tx.amount);
  }

  const anomalies: SpendingAnomaly[] = [];

  for (const tx of transactions) {
    const amounts = groups.get(tx.description) || [];
    if (amounts.length < 3) continue;

    const mean = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const variance =
      amounts.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / amounts.length;
    const stdDev = Math.sqrt(variance);

    const zScore = Math.abs((tx.amount - mean) / stdDev);

    if (zScore > threshold) {
      anomalies.push({
        date: tx.date,
        description: tx.description,
        amount: tx.amount,
        expectedAmount: mean,
        deviation: zScore,
      });
    }
  }

  return anomalies;
};
