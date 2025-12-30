"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsService = void 0;
const prisma_1 = require("../utils/prisma");
/**
 * Advanced financial analytics service
 * Provides insights, trends, and forecasting
 */
exports.analyticsService = {
    /**
     * Get spending trends (monthly comparison)
     */
    getSpendingTrends: async (userId, months = 6) => {
        const data = await prisma_1.prisma.transaction.groupBy({
            by: ['createdAt'],
            where: {
                userId,
                type: 'expense',
            },
            _sum: {
                amount: true,
            },
            orderBy: {
                createdAt: 'asc',
            },
        });
        return data.map(item => ({
            month: new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            amount: item._sum.amount || 0,
        }));
    },
    /**
     * Get category breakdown by percentage
     */
    getCategoryBreakdown: async (userId) => {
        const transactions = await prisma_1.prisma.transaction.groupBy({
            by: ['categoryId'],
            where: {
                userId,
                type: 'expense',
            },
            _sum: {
                amount: true,
            },
        });
        const total = transactions.reduce((sum, t) => sum + (t._sum.amount || 0), 0);
        return Promise.all(transactions.map(async (t) => {
            const category = await prisma_1.prisma.category.findUnique({
                where: { id: t.categoryId },
                select: { name: true, color: true },
            });
            return {
                category: category?.name || 'Unknown',
                color: category?.color,
                amount: t._sum.amount || 0,
                percentage: ((t._sum.amount || 0) / total) * 100,
            };
        }));
    },
    /**
     * Calculate savings rate
     */
    calculateSavingsRate: async (userId, months = 3) => {
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - months);
        const transactions = await prisma_1.prisma.transaction.groupBy({
            by: ['type'],
            where: {
                userId,
                createdAt: { gte: startDate },
            },
            _sum: {
                amount: true,
            },
        });
        const income = transactions.find(t => t.type === 'income')?._sum.amount || 0;
        const expenses = transactions.find(t => t.type === 'expense')?._sum.amount || 0;
        const savings = income - expenses;
        const savingsRate = income > 0 ? (savings / income) * 100 : 0;
        return {
            income,
            expenses,
            savings,
            savingsRate: parseFloat(savingsRate.toFixed(2)),
        };
    },
    /**
     * Get spending forecast (simple linear regression)
     */
    getSpendingForecast: async (userId, months = 3) => {
        const trends = await this.getSpendingTrends(userId, 6);
        if (trends.length < 2) {
            return trends.map(t => ({ ...t, forecast: t.amount }));
        }
        const amounts = trends.map(t => t.amount);
        const n = amounts.length;
        const sumX = (n * (n + 1)) / 2;
        const sumY = amounts.reduce((a, b) => a + b, 0);
        const sumXY = amounts.reduce((sum, y, i) => sum + (i + 1) * y, 0);
        const sumX2 = (n * (n + 1) * (2 * n + 1)) / 6;
        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;
        return trends.map((t, i) => ({
            ...t,
            forecast: intercept + slope * (i + 1),
        }));
    },
    /**
     * Get budget vs actual comparison
     */
    getBudgetVsActual: async (userId) => {
        const budgets = await prisma_1.prisma.budget.findMany({
            where: { userId },
            include: { category: true },
        });
        return Promise.all(budgets.map(async (budget) => {
            const actual = await prisma_1.prisma.transaction.aggregate({
                where: {
                    userId,
                    categoryId: budget.categoryId,
                    type: 'expense',
                },
                _sum: { amount: true },
            });
            const spent = actual._sum.amount || 0;
            const remaining = Math.max(0, budget.limit - spent);
            const percentage = (spent / budget.limit) * 100;
            return {
                category: budget.category.name,
                budgeted: budget.limit,
                spent,
                remaining,
                percentage: parseFloat(percentage.toFixed(2)),
                status: spent > budget.limit ? 'exceeded' : spent > budget.limit * 0.9 ? 'warning' : 'ok',
            };
        }));
    },
    /**
     * Get top spending categories
     */
    getTopCategories: async (userId, limit = 5) => {
        const categories = await prisma_1.prisma.transaction.groupBy({
            by: ['categoryId'],
            where: {
                userId,
                type: 'expense',
            },
            _sum: { amount: true },
            orderBy: { _sum: { amount: 'desc' } },
            take: limit,
        });
        return Promise.all(categories.map(async (c) => {
            const category = await prisma_1.prisma.category.findUnique({
                where: { id: c.categoryId },
                select: { name: true },
            });
            return {
                name: category?.name || 'Unknown',
                amount: c._sum.amount || 0,
            };
        }));
    },
    /**
     * Get financial health score (0-100)
     */
    getHealthScore: async (userId) => {
        const savingsRate = await this.calculateSavingsRate(userId);
        const budgets = await this.getBudgetVsActual(userId);
        const goals = await prisma_1.prisma.savingsGoal.findMany({
            where: { userId },
        });
        let score = 100;
        // Savings rate (30 points)
        if (savingsRate.savingsRate < 10)
            score -= 30;
        else if (savingsRate.savingsRate < 20)
            score -= 15;
        else if (savingsRate.savingsRate >= 20)
            score += 0; // Good
        // Budget adherence (30 points)
        const exceededCount = budgets.filter(b => b.status === 'exceeded').length;
        const warningCount = budgets.filter(b => b.status === 'warning').length;
        score -= exceededCount * 10 + warningCount * 5;
        // Goals progress (40 points)
        if (goals.length === 0)
            score -= 20;
        else {
            const avgProgress = goals.reduce((sum, g) => sum + g.currentAmount / g.targetAmount, 0) / goals.length;
            score += avgProgress * 40 - 20;
        }
        return Math.max(0, Math.min(100, score));
    },
};
//# sourceMappingURL=analytics.service.js.map