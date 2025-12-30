"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBudgetProgress = exports.deleteBudget = exports.updateBudget = exports.createBudget = exports.getBudgetById = exports.getBudgets = void 0;
const prisma_1 = require("../utils/prisma");
const errors_1 = require("../utils/errors");
/**
 * Get all budgets for a user
 */
const getBudgets = async (userId) => {
    return prisma_1.prisma.budget.findMany({
        where: { userId },
        include: {
            category: true,
        },
        orderBy: { startDate: 'desc' },
    });
};
exports.getBudgets = getBudgets;
/**
 * Get a single budget by ID
 */
const getBudgetById = async (budgetId, userId) => {
    const budget = await prisma_1.prisma.budget.findFirst({
        where: {
            id: budgetId,
            userId,
        },
        include: {
            category: true,
        },
    });
    if (!budget) {
        throw new errors_1.NotFoundError('Budget');
    }
    return budget;
};
exports.getBudgetById = getBudgetById;
/**
 * Create a new budget
 */
const createBudget = async (userId, data) => {
    // Validate category if provided
    if (data.categoryId) {
        const category = await prisma_1.prisma.category.findFirst({
            where: {
                id: data.categoryId,
                userId,
            },
        });
        if (!category) {
            throw new errors_1.ValidationError('Category not found', {
                categoryId: ['Category does not exist or does not belong to you'],
            });
        }
    }
    // Validate amount
    if (data.amount <= 0) {
        throw new errors_1.ValidationError('Invalid amount', {
            amount: ['Amount must be greater than 0'],
        });
    }
    // Validate dates
    if (data.endDate && data.endDate <= data.startDate) {
        throw new errors_1.ValidationError('Invalid date range', {
            endDate: ['End date must be after start date'],
        });
    }
    return prisma_1.prisma.budget.create({
        data: {
            ...data,
            userId,
        },
        include: {
            category: true,
        },
    });
};
exports.createBudget = createBudget;
/**
 * Update a budget
 */
const updateBudget = async (budgetId, userId, data) => {
    // Check if budget exists and belongs to user
    const budget = await (0, exports.getBudgetById)(budgetId, userId);
    // Validate category if provided
    if (data.categoryId !== undefined && data.categoryId !== null) {
        const category = await prisma_1.prisma.category.findFirst({
            where: {
                id: data.categoryId,
                userId,
            },
        });
        if (!category) {
            throw new errors_1.ValidationError('Category not found', {
                categoryId: ['Category does not exist or does not belong to you'],
            });
        }
    }
    // Validate amount if provided
    if (data.amount !== undefined && data.amount <= 0) {
        throw new errors_1.ValidationError('Invalid amount', {
            amount: ['Amount must be greater than 0'],
        });
    }
    // Validate dates
    const startDate = data.startDate || budget.startDate;
    const endDate = data.endDate !== undefined ? data.endDate : budget.endDate;
    if (endDate && endDate <= startDate) {
        throw new errors_1.ValidationError('Invalid date range', {
            endDate: ['End date must be after start date'],
        });
    }
    return prisma_1.prisma.budget.update({
        where: { id: budgetId },
        data,
        include: {
            category: true,
        },
    });
};
exports.updateBudget = updateBudget;
/**
 * Delete a budget
 */
const deleteBudget = async (budgetId, userId) => {
    // Check if budget exists and belongs to user
    await (0, exports.getBudgetById)(budgetId, userId);
    return prisma_1.prisma.budget.delete({
        where: { id: budgetId },
    });
};
exports.deleteBudget = deleteBudget;
/**
 * Get budget progress (spent vs budgeted)
 */
const getBudgetProgress = async (budgetId, userId) => {
    const budget = await (0, exports.getBudgetById)(budgetId, userId);
    // Calculate spent amount from transactions in budget period
    const where = {
        userId,
        type: 'EXPENSE',
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
    const spent = await prisma_1.prisma.transaction.aggregate({
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
exports.getBudgetProgress = getBudgetProgress;
//# sourceMappingURL=budget.service.js.map