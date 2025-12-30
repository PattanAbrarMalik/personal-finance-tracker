/**
 * Advanced Prisma query utilities
 * Reusable queries for common operations
 */

import { prisma } from './prisma';

export const queries = {
  /**
   * Get user with all relations
   */
  getUserWithRelations: (userId: string) => {
    return prisma.user.findUnique({
      where: { id: userId },
      include: {
        transactions: { take: 10, orderBy: { createdAt: 'desc' } },
        categories: true,
        budgets: { include: { category: true } },
        savingsGoals: true,
      },
    });
  },

  /**
   * Get transactions with filters and pagination
   */
  getTransactionsFiltered: (
    userId: string,
    options: {
      skip: number;
      take: number;
      categoryId?: string;
      type?: 'income' | 'expense';
      startDate?: Date;
      endDate?: Date;
    }
  ) => {
    return prisma.transaction.findMany({
      where: {
        userId,
        ...(options.categoryId && { categoryId: options.categoryId }),
        ...(options.type && { type: options.type }),
        ...(options.startDate || options.endDate) && {
          createdAt: {
            ...(options.startDate && { gte: options.startDate }),
            ...(options.endDate && { lte: options.endDate }),
          },
        },
      },
      include: { category: true },
      skip: options.skip,
      take: options.take,
      orderBy: { createdAt: 'desc' },
    });
  },

  /**
   * Count transactions with filters
   */
  countTransactionsFiltered: (
    userId: string,
    options: {
      categoryId?: string;
      type?: 'income' | 'expense';
      startDate?: Date;
      endDate?: Date;
    }
  ) => {
    return prisma.transaction.count({
      where: {
        userId,
        ...(options.categoryId && { categoryId: options.categoryId }),
        ...(options.type && { type: options.type }),
        ...(options.startDate || options.endDate) && {
          createdAt: {
            ...(options.startDate && { gte: options.startDate }),
            ...(options.endDate && { lte: options.endDate }),
          },
        },
      },
    });
  },

  /**
   * Get monthly summary
   */
  getMonthlySummary: (userId: string, year: number, month: number) => {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    return prisma.transaction.groupBy({
      by: ['type'],
      where: {
        userId,
        createdAt: { gte: startDate, lte: endDate },
      },
      _sum: { amount: true },
      _count: { id: true },
    });
  },

  /**
   * Get upcoming bills (next 30 days)
   */
  getUpcomingBills: (userId: string) => {
    const today = new Date();
    const in30Days = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    return prisma.transaction.findMany({
      where: {
        userId,
        type: 'expense',
        createdAt: { gte: today, lte: in30Days },
      },
      orderBy: { createdAt: 'asc' },
      take: 10,
    });
  },

  /**
   * Get budget status
   */
  getBudgetStatus: (budgetId: string) => {
    return prisma.budget.findUnique({
      where: { id: budgetId },
      include: {
        category: true,
        _count: {
          transactions: true,
        },
      },
    });
  },

  /**
   * Get savings goals progress
   */
  getSavingsGoalProgress: (userId: string) => {
    return prisma.savingsGoal.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        targetAmount: true,
        currentAmount: true,
        deadline: true,
        createdAt: true,
      },
    });
  },

  /**
   * Archive old transactions (older than 1 year)
   */
  archiveOldTransactions: (userId: string) => {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    return prisma.transaction.updateMany({
      where: {
        userId,
        createdAt: { lt: oneYearAgo },
      },
      data: {
        // Add archived flag if available in schema
      },
    });
  },
};
