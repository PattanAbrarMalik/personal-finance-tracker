"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionStats = exports.deleteTransaction = exports.updateTransaction = exports.createTransaction = exports.getTransactionById = exports.getTransactions = void 0;
const prisma_1 = require("../utils/prisma");
const errors_1 = require("../utils/errors");
const client_1 = require("@prisma/client");
/**
 * Get transactions for a user with optional filters
 */
const getTransactions = async (userId, filters = {}) => {
    const { type, categoryId, startDate, endDate, page = 1, limit = 50, } = filters;
    const where = { userId };
    if (type) {
        where.type = type;
    }
    if (categoryId) {
        where.categoryId = categoryId;
    }
    if (startDate || endDate) {
        where.date = {};
        if (startDate)
            where.date.gte = startDate;
        if (endDate)
            where.date.lte = endDate;
    }
    const skip = (page - 1) * limit;
    const [transactions, total] = await Promise.all([
        prisma_1.prisma.transaction.findMany({
            where,
            include: {
                category: true,
            },
            orderBy: { date: 'desc' },
            skip,
            take: limit,
        }),
        prisma_1.prisma.transaction.count({ where }),
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
exports.getTransactions = getTransactions;
/**
 * Get a single transaction by ID
 */
const getTransactionById = async (transactionId, userId) => {
    const transaction = await prisma_1.prisma.transaction.findFirst({
        where: {
            id: transactionId,
            userId,
        },
        include: {
            category: true,
        },
    });
    if (!transaction) {
        throw new errors_1.NotFoundError('Transaction');
    }
    return transaction;
};
exports.getTransactionById = getTransactionById;
/**
 * Create a new transaction
 */
const createTransaction = async (userId, data) => {
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
    // Ensure amount is positive
    if (data.amount <= 0) {
        throw new errors_1.ValidationError('Invalid amount', {
            amount: ['Amount must be greater than 0'],
        });
    }
    return prisma_1.prisma.transaction.create({
        data: {
            ...data,
            userId,
        },
        include: {
            category: true,
        },
    });
};
exports.createTransaction = createTransaction;
/**
 * Update a transaction
 */
const updateTransaction = async (transactionId, userId, data) => {
    // Check if transaction exists and belongs to user
    await (0, exports.getTransactionById)(transactionId, userId);
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
    return prisma_1.prisma.transaction.update({
        where: { id: transactionId },
        data,
        include: {
            category: true,
        },
    });
};
exports.updateTransaction = updateTransaction;
/**
 * Delete a transaction
 */
const deleteTransaction = async (transactionId, userId) => {
    // Check if transaction exists and belongs to user
    await (0, exports.getTransactionById)(transactionId, userId);
    return prisma_1.prisma.transaction.delete({
        where: { id: transactionId },
    });
};
exports.deleteTransaction = deleteTransaction;
/**
 * Get transaction statistics for a user
 */
const getTransactionStats = async (userId, startDate, endDate) => {
    const where = { userId };
    if (startDate || endDate) {
        where.date = {};
        if (startDate)
            where.date.gte = startDate;
        if (endDate)
            where.date.lte = endDate;
    }
    const [income, expenses] = await Promise.all([
        prisma_1.prisma.transaction.aggregate({
            where: { ...where, type: client_1.TransactionType.INCOME },
            _sum: { amount: true },
        }),
        prisma_1.prisma.transaction.aggregate({
            where: { ...where, type: client_1.TransactionType.EXPENSE },
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
        transactionCount: await prisma_1.prisma.transaction.count({ where }),
    };
};
exports.getTransactionStats = getTransactionStats;
//# sourceMappingURL=transaction.service.js.map