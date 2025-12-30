/**
 * Tax and Financial Ratio Calculations
 */

export interface TaxCalculation {
  income: number;
  taxableIncome: number;
  estimatedTax: number;
  effectiveTaxRate: number;
  taxDeductions: Record<string, number>;
}

export interface FinancialRatios {
  savingsRate: number;
  debtToIncomeRatio: number;
  liquidityRatio: number;
  expenseRatio: number;
  investmentRatio: number;
}

export class TaxAndRatioService {
  /**
   * Calculate estimated taxes (US Federal 2024)
   */
  static calculateEstimatedTaxes(
    grossIncome: number,
    filingStatus: 'single' | 'married' | 'head_of_household' = 'single',
    deductions: Record<string, number> = {}
  ): TaxCalculation {
    // 2024 Tax brackets (simplified)
    const brackets: Record<string, number[][]> = {
      single: [
        [11600, 0.1],
        [47150, 0.12],
        [100525, 0.22],
        [191950, 0.24],
        [243725, 0.32],
        [609350, 0.35],
        [Infinity, 0.37],
      ],
      married: [
        [23200, 0.1],
        [94300, 0.12],
        [201050, 0.22],
        [383900, 0.24],
        [487450, 0.32],
        [731200, 0.35],
        [Infinity, 0.37],
      ],
      head_of_household: [
        [17400, 0.1],
        [66550, 0.12],
        [168600, 0.22],
        [321550, 0.24],
        [409750, 0.32],
        [613350, 0.35],
        [Infinity, 0.37],
      ],
    };

    const standardDeductions: Record<string, number> = {
      single: 14600,
      married: 29200,
      head_of_household: 21900,
    };

    const totalDeductions =
      Object.values(deductions).reduce((a, b) => a + b, 0) ||
      standardDeductions[filingStatus];
    const taxableIncome = Math.max(0, grossIncome - totalDeductions);

    // Calculate tax
    let tax = 0;
    let previousBracket = 0;
    for (const [limit, rate] of brackets[filingStatus]) {
      if (taxableIncome <= previousBracket) break;
      const taxableInThisBracket = Math.min(taxableIncome, limit) - previousBracket;
      tax += taxableInThisBracket * rate;
      previousBracket = limit;
    }

    return {
      income: grossIncome,
      taxableIncome,
      estimatedTax: Math.round(tax),
      effectiveTaxRate: grossIncome > 0 ? (tax / grossIncome) * 100 : 0,
      taxDeductions: deductions,
    };
  }

  /**
   * Calculate financial health ratios
   */
  static calculateFinancialRatios(
    monthlyIncome: number,
    monthlyExpenses: number,
    savings: number,
    debt: number,
    liquidAssets: number,
    investments: number
  ): FinancialRatios {
    return {
      savingsRate: ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100,
      debtToIncomeRatio: debt / (monthlyIncome * 12),
      liquidityRatio: liquidAssets / monthlyExpenses,
      expenseRatio: (monthlyExpenses / monthlyIncome) * 100,
      investmentRatio: (investments / (savings + investments || 1)) * 100,
    };
  }

  /**
   * Get financial health assessment
   */
  static assessFinancialHealth(ratios: FinancialRatios): {
    score: number;
    grade: string;
    assessment: string;
  } {
    let score = 0;

    // Savings rate (ideal: 20% or more)
    score += Math.min(ratios.savingsRate / 20 * 25, 25);

    // Debt to income ratio (ideal: < 0.36)
    score += Math.max(0, 25 - ratios.debtToIncomeRatio * 70);

    // Liquidity ratio (ideal: > 1)
    score += Math.min(ratios.liquidityRatio / 3 * 25, 25);

    // Investment ratio (ideal: > 50%)
    score += Math.min(ratios.investmentRatio / 50 * 25, 25);

    let grade = '';
    let assessment = '';

    if (score >= 90) {
      grade = 'A';
      assessment = 'Excellent financial health';
    } else if (score >= 80) {
      grade = 'B';
      assessment = 'Good financial health';
    } else if (score >= 70) {
      grade = 'C';
      assessment = 'Fair financial health';
    } else if (score >= 60) {
      grade = 'D';
      assessment = 'Poor financial health';
    } else {
      grade = 'F';
      assessment = 'Critical financial health';
    }

    return { score: Math.round(score), grade, assessment };
  }
}
