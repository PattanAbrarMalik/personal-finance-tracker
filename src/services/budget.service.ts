import { prisma } from '../utils/prisma';
import { NotFoundError, ValidationError } from '../utils/errors';
import { BudgetPeriod } from '@prisma/client';

export interface CreateBudgetData {
  name: string;
  amount: number;
  period: BudgetPeriod;
  categoryId?: string;
  startDate: Date;
  endDate?: Date;
}

export interface UpdateBudgetData {
  name?: string;
  amount?: number;
  period?: BudgetPeriod;
  categoryId?: string | null;
  startDate?: Date;
  endDate?: Date | null;
}

/**
 * Get all budgets for a user
 */
export const getBudgets = async (userId: string) => {
  return prisma.budget.findMany({
    where: { userId },
    include: {
      category: true,
    },
    orderBy: { startDate: 'desc' },
  });
};

/**
 * Get a single budget by ID
 */
export const getBudgetById = async (budgetId: string, userId: string) => {
  const budget = await prisma.budget.findFirst({
    where: {
      id: budgetId,
      userId,
    },
    include: {
      category: true,
    },
  });

  if (!budget) {
    throw new NotFoundError('Budget');
  }

  return budget;
};

/**
 * Create a new budget
 */
export const createBudget = async (userId: string, data: CreateBudgetData) => {
  // Validate category if provided
  if (data.categoryId) {
    const category = await prisma.category.findFirst({
      where: {
        id: data.categoryId,
        userId,
      },
    });

    if (!category) {
      throw new ValidationError('Category not found', {
        categoryId: ['Category does not exist or does not belong to you'],
      });
    }
  }

  // Validate amount
  if (data.amount <= 0) {
    throw new ValidationError('Invalid amount', {
      amount: ['Amount must be greater than 0'],
    });
  }

  // Validate dates
  if (data.endDate && data.endDate <= data.startDate) {
    throw new ValidationError('Invalid date range', {
      endDate: ['End date must be after start date'],
    });
  }

  return prisma.budget.create({
    data: {
      ...data,
      userId,
    },
    include: {
      category: true,
    },
  });
};

/**
 * Update a budget
 */
export const updateBudget = async (
  budgetId: string,
  userId: string,
  data: UpdateBudgetData
) => {
  // Check if budget exists and belongs to user
  const budget = await getBudgetById(budgetId, userId);

  // Validate category if provided
  if (data.categoryId !== undefined && data.categoryId !== null) {
    const category = await prisma.category.findFirst({
      where: {
        id: data.categoryId,
        userId,
      },
    });

    if (!category) {
      throw new ValidationError('Category not found', {
        categoryId: ['Category does not exist or does not belong to you'],
      });
    }
  }

  // Validate amount if provided
  if (data.amount !== undefined && data.amount <= 0) {
    throw new ValidationError('Invalid amount', {
      amount: ['Amount must be greater than 0'],
    });
  }

  // Validate dates
  const startDate = data.startDate || budget.startDate;
  const endDate = data.endDate !== undefined ? data.endDate : budget.endDate;

  if (endDate && endDate <= startDate) {
    throw new ValidationError('Invalid date range', {
      endDate: ['End date must be after start date'],
    });
  }

  return prisma.budget.update({
    where: { id: budgetId },
    data,
    include: {
      category: true,
    },
  });
};

/**
 * Delete a budget
 */
export const deleteBudget = async (budgetId: string, userId: string) => {
  // Check if budget exists and belongs to user
  await getBudgetById(budgetId, userId);

  return prisma.budget.delete({
    where: { id: budgetId },
  });
};

/**
 * Get budget progress (spent vs budgeted)
 */
export const getBudgetProgress = async (budgetId: string, userId: string) => {
  const budget = await getBudgetById(budgetId, userId);

  // Calculate spent amount from transactions in budget period
  const where: any = {
    userId,
    type: 'EXPENSE' as const,
    date: {
      gte: budget.startDate,
    },
  };

  if (budget.endDate) {
    where.date.lte = budget.endDate;
  }

  if (budget.categoryId) {
    where.categoryId = budget.categoryId;
  }

  const spent = await prisma.transaction.aggregate({
    where,
    _sum: { amount: true },
  });

  const spentAmount = spent._sum.amount || 0;
  const remaining = budget.amount - spentAmount;
  const percentage = budget.amount > 0 ? (spentAmount / budget.amount) * 100 : 0;

  return {
    budget,
    spent: spentAmount,
    remaining,
    percentage: Math.min(percentage, 100),
    isExceeded: spentAmount > budget.amount,
  };
};








