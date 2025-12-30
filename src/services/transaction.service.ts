import { prisma } from '../utils/prisma';
import { NotFoundError, ValidationError } from '../utils/errors';
import { TransactionType } from '@prisma/client';

export interface CreateTransactionData {
  amount: number;
  description: string;
  type: TransactionType;
  date: Date;
  categoryId?: string;
}

export interface UpdateTransactionData {
  amount?: number;
  description?: string;
  type?: TransactionType;
  date?: Date;
  categoryId?: string | null;
}

export interface TransactionFilters {
  type?: TransactionType;
  categoryId?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

/**
 * Get transactions for a user with optional filters
 */
export const getTransactions = async (userId: string, filters: TransactionFilters = {}) => {
  const {
    type,
    categoryId,
    startDate,
    endDate,
    page = 1,
    limit = 50,
  } = filters;

  const where: any = { userId };

  if (type) {
    where.type = type;
  }

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = startDate;
    if (endDate) where.date.lte = endDate;
  }

  const skip = (page - 1) * limit;

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: { date: 'desc' },
      skip,
      take: limit,
    }),
    prisma.transaction.count({ where }),
  ]);

  return {
    transactions,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get a single transaction by ID
 */
export const getTransactionById = async (transactionId: string, userId: string) => {
  const transaction = await prisma.transaction.findFirst({
    where: {
      id: transactionId,
      userId,
    },
    include: {
      category: true,
    },
  });

  if (!transaction) {
    throw new NotFoundError('Transaction');
  }

  return transaction;
};

/**
 * Create a new transaction
 */
export const createTransaction = async (userId: string, data: CreateTransactionData) => {
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

  // Ensure amount is positive
  if (data.amount <= 0) {
    throw new ValidationError('Invalid amount', {
      amount: ['Amount must be greater than 0'],
    });
  }

  return prisma.transaction.create({
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
 * Update a transaction
 */
export const updateTransaction = async (
  transactionId: string,
  userId: string,
  data: UpdateTransactionData
) => {
  // Check if transaction exists and belongs to user
  await getTransactionById(transactionId, userId);

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

  return prisma.transaction.update({
    where: { id: transactionId },
    data,
    include: {
      category: true,
    },
  });
};

/**
 * Delete a transaction
 */
export const deleteTransaction = async (transactionId: string, userId: string) => {
  // Check if transaction exists and belongs to user
  await getTransactionById(transactionId, userId);

  return prisma.transaction.delete({
    where: { id: transactionId },
  });
};

/**
 * Get transaction statistics for a user
 */
export const getTransactionStats = async (userId: string, startDate?: Date, endDate?: Date) => {
  const where: any = { userId };

  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = startDate;
    if (endDate) where.date.lte = endDate;
  }

  const [income, expenses] = await Promise.all([
    prisma.transaction.aggregate({
      where: { ...where, type: TransactionType.INCOME },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: { ...where, type: TransactionType.EXPENSE },
      _sum: { amount: true },
    }),
  ]);

  const totalIncome = income._sum.amount || 0;
  const totalExpenses = expenses._sum.amount || 0;
  const balance = totalIncome - totalExpenses;

  return {
    totalIncome,
    totalExpenses,
    balance,
    transactionCount: await prisma.transaction.count({ where }),
  };
};








