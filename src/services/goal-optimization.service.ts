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

export class GoalOptimizationService {
  /**
   * Calculate optimal monthly contribution for goal
   */
  static calculateOptimalContribution(goal: any, monthsAvailable: number): number {
    const needed = goal.targetAmount - goal.currentAmount;
    return Math.ceil(needed / monthsAvailable);
  }

  /**
   * Analyze goal feasibility
   */
  static analyzeFeasibility(
    goal: any,
    monthlyIncome: number,
    otherObligations: number
  ): GoalOptimization {
    const monthsAvailable = Math.max(
      1,
      Math.floor(
        (new Date(goal.deadline).getTime() - new Date().getTime()) / (30 * 24 * 60 * 60 * 1000)
      )
    );

    const needed = goal.targetAmount - goal.currentAmount;
    const monthlyNeeded = Math.ceil(needed / monthsAvailable);
    const availableAfterObligations = monthlyIncome - otherObligations;

    let feasibility: 'easy' | 'moderate' | 'challenging' | 'unrealistic';
    if (monthlyNeeded <= availableAfterObligations * 0.2) feasibility = 'easy';
    else if (monthlyNeeded <= availableAfterObligations * 0.5) feasibility = 'moderate';
    else if (monthlyNeeded <= availableAfterObligations) feasibility = 'challenging';
    else feasibility = 'unrealistic';

    return {
      currentGoal: goal,
      monthlyContribution: monthlyNeeded,
      completionDate: goal.deadline,
      totalContributions: monthlyNeeded * monthsAvailable,
      feasibility,
    };
  }

  /**
   * Create financial plan across multiple goals
   */
  static createFinancialPlan(
    goals: any[],
    monthlyIncome: number,
    necessaryExpenses: number
  ): FinancialPlan {
    const availableForGoals = monthlyIncome - necessaryExpenses;
    const optimizations = goals.map(g =>
      this.analyzeFeasibility(g, monthlyIncome, necessaryExpenses)
    );

    // Calculate priority scores
    const priorityScore: Record<string, number> = {};
    for (const goal of goals) {
      const monthsToDeadline = Math.max(
        1,
        Math.floor(
          (new Date(goal.deadline).getTime() - new Date().getTime()) / (30 * 24 * 60 * 60 * 1000)
        )
      );
      const urgency = 12 / monthsToDeadline; // Higher for sooner deadlines
      const importance = (goal.priority === 'high' ? 3 : goal.priority === 'medium' ? 2 : 1);
      const progress = goal.currentAmount / goal.targetAmount;

      priorityScore[goal.id] = urgency * importance * (1 - progress);
    }

    // Sort by priority
    const sortedGoals = goals.sort((a, b) => (priorityScore[b.id] || 0) - (priorityScore[a.id] || 0));

    // Generate recommendations
    const recommendations: string[] = [];
    const totalNeeded = optimizations.reduce((sum, o) => sum + o.monthlyContribution, 0);

    if (totalNeeded > availableForGoals) {
      recommendations.push(
        `Your goals require $${totalNeeded.toFixed(2)}/month but you have $${availableForGoals.toFixed(2)} available`
      );
      recommendations.push(
        `Focus on priorities: ${sortedGoals.map(g => g.name).join(', ')}`
      );
    } else {
      recommendations.push(
        `You can afford all goals and have $${(availableForGoals - totalNeeded).toFixed(2)}/month remaining`
      );
    }

    return {
      goals: sortedGoals,
      totalMonthlyContribution: totalNeeded,
      priorityScore,
      recommendations,
    };
  }

  /**
   * Suggest goal adjustments for achievability
   */
  static suggestAdjustments(goal: any, monthlyIncome: number, available: number): any {
    if (available <= 0) {
      return {
        recommendation: 'Reduce necessary expenses to free up funds',
        newTarget: goal.targetAmount,
        adjustedDeadline: new Date(Date.now() + 24 * 30 * 24 * 60 * 60 * 1000), // 2 years out
      };
    }

    const monthsAvailable = Math.max(
      1,
      Math.floor(
        (new Date(goal.deadline).getTime() - new Date().getTime()) / (30 * 24 * 60 * 60 * 1000)
      )
    );

    const achievableTarget = goal.currentAmount + available * monthsAvailable;

    return {
      recommendation:
        achievableTarget >= goal.targetAmount
          ? 'Goal is achievable'
          : 'Extend deadline or reduce target',
      achievableTarget: Math.round(achievableTarget),
      suggestedDeadline: goal.deadline,
    };
  }
}
