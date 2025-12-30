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
export declare class TaxAndRatioService {
    /**
     * Calculate estimated taxes (US Federal 2024)
     */
    static calculateEstimatedTaxes(grossIncome: number, filingStatus?: 'single' | 'married' | 'head_of_household', deductions?: Record<string, number>): TaxCalculation;
    /**
     * Calculate financial health ratios
     */
    static calculateFinancialRatios(monthlyIncome: number, monthlyExpenses: number, savings: number, debt: number, liquidAssets: number, investments: number): FinancialRatios;
    /**
     * Get financial health assessment
     */
    static assessFinancialHealth(ratios: FinancialRatios): {
        score: number;
        grade: string;
        assessment: string;
    };
}
//# sourceMappingURL=tax-and-ratios.service.d.ts.map