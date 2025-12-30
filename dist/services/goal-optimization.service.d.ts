/**
 * Goal Optimization and Financial Planning Service
 */
export interface GoalOptimization {
    currentGoal: any;
    monthlyContribution: number;
    completionDate: Date;
    totalContributions: number;
    feasibility: 'easy' | 'moderate' | 'challenging' | 'unrealistic';
}
export interface FinancialPlan {
    goals: any[];
    totalMonthlyContribution: number;
    priorityScore: Record<string, number>;
    recommendations: string[];
}
export declare class GoalOptimizationService {
    /**
     * Calculate optimal monthly contribution for goal
     */
    static calculateOptimalContribution(goal: any, monthsAvailable: number): number;
    /**
     * Analyze goal feasibility
     */
    static analyzeFeasibility(goal: any, monthlyIncome: number, otherObligations: number): GoalOptimization;
    /**
     * Create financial plan across multiple goals
     */
    static createFinancialPlan(goals: any[], monthlyIncome: number, necessaryExpenses: number): FinancialPlan;
    /**
     * Suggest goal adjustments for achievability
     */
    static suggestAdjustments(goal: any, monthlyIncome: number, available: number): any;
}
//# sourceMappingURL=goal-optimization.service.d.ts.map