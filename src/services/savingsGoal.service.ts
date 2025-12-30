import { prisma } from '../utils/prisma';
import { SavingsGoal } from '@prisma/client';

export interface CreateSavingsGoalData {
  name: string;
  description?: string;
  targetAmount: number;
  category?: string;
  icon?: string;
  color?: string;
  deadline?: Date;
  priority?: string;
}

export interface UpdateSavingsGoalData extends Partial<CreateSavingsGoalData> {}

export const savingsGoalService = {
  // Get all goals for a user
  async getGoalsByUserId(userId: string): Promise<SavingsGoal[]> {
    return prisma.savingsGoal.findMany({
      where: { userId },
      orderBy: [{ priority: 'desc' }, { deadline: 'asc' }, { createdAt: 'desc' }],
    });
  },

  // Get single goal
  async getGoalById(id: string): Promise<SavingsGoal | null> {
    return prisma.savingsGoal.findUnique({
      where: { id },
    });
  },

  // Create new goal
  async createGoal(userId: string, data: CreateSavingsGoalData): Promise<SavingsGoal> {
    return prisma.savingsGoal.create({
      data: {
        ...data,
        userId,
        icon: data.icon || '🎯',
        color: data.color || '#3B82F6',
        priority: data.priority || 'medium',
      },
    });
  },

  // Update goal
  async updateGoal(id: string, data: UpdateSavingsGoalData): Promise<SavingsGoal> {
    return prisma.savingsGoal.update({
      where: { id },
      data,
    });
  },

  // Delete goal
  async deleteGoal(id: string): Promise<SavingsGoal> {
    return prisma.savingsGoal.delete({
      where: { id },
    });
  },

  // Add amount to goal
  async addAmountToGoal(id: string, amount: number): Promise<SavingsGoal> {
    const goal = await prisma.savingsGoal.findUnique({ where: { id } });

    if (!goal) {
      throw new Error('Goal not found');
    }

    return prisma.savingsGoal.update({
      where: { id },
      data: {
        currentAmount: goal.currentAmount + amount,
      },
    });
  },

  // Get progress statistics
  async getUserSavingsStats(userId: string): Promise<{
    totalGoals: number;
    completedGoals: number;
    totalTargetAmount: number;
    totalCurrentAmount: number;
    progressPercentage: number;
    averageProgressPercentage: number;
  }> {
    const goals = await prisma.savingsGoal.findMany({
      where: { userId },
    });

    const totalTargetAmount = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
    const totalCurrentAmount = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
    const completedGoals = goals.filter(
      (goal) => goal.currentAmount >= goal.targetAmount
    ).length;
    const progressPercentage = totalTargetAmount > 0 ? (totalCurrentAmount / totalTargetAmount) * 100 : 0;
    const averageProgressPercentage =
      goals.length > 0
        ? goals.reduce((sum, goal) => sum + Math.min((goal.currentAmount / goal.targetAmount) * 100, 100), 0) /
          goals.length
        : 0;

    return {
      totalGoals: goals.length,
      completedGoals,
      totalTargetAmount,
      totalCurrentAmount,
      progressPercentage,
      averageProgressPercentage,
    };
  },
};
