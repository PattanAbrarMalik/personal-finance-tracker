"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.savingsGoalController = void 0;
const prisma_1 = require("../utils/prisma");
const AppError_1 = require("../utils/errors/AppError");
exports.savingsGoalController = {
    // Get all savings goals for user
    getAll: async (req, res, next) => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                throw new AppError_1.AppError('Unauthorized', 401);
            }
            const goals = await prisma_1.prisma.savingsGoal.findMany({
                where: { userId },
                orderBy: [{ priority: 'desc' }, { deadline: 'asc' }, { createdAt: 'desc' }],
            });
            res.json({
                success: true,
                data: goals,
            });
        }
        catch (error) {
            next(error);
        }
    },
    // Get single savings goal
    getById: async (req, res, next) => {
        try {
            const { id } = req.params;
            const userId = req.user?.userId;
            if (!userId) {
                throw new AppError_1.AppError('Unauthorized', 401);
            }
            const goal = await prisma_1.prisma.savingsGoal.findFirst({
                where: { id, userId },
            });
            if (!goal) {
                throw new AppError_1.AppError('Savings goal not found', 404);
            }
            res.json({
                success: true,
                data: goal,
            });
        }
        catch (error) {
            next(error);
        }
    },
    // Create savings goal
    create: async (req, res, next) => {
        try {
            const userId = req.user?.userId;
            const { name, description, targetAmount, category, icon, color, deadline, priority, } = req.body;
            if (!userId) {
                throw new AppError_1.AppError('Unauthorized', 401);
            }
            if (!name || !targetAmount) {
                throw new AppError_1.AppError('Name and target amount are required', 400);
            }
            if (targetAmount <= 0) {
                throw new AppError_1.AppError('Target amount must be greater than 0', 400);
            }
            const goal = await prisma_1.prisma.savingsGoal.create({
                data: {
                    name,
                    description,
                    targetAmount,
                    category,
                    icon: icon || '🎯',
                    color: color || '#3B82F6',
                    deadline: deadline ? new Date(deadline) : null,
                    priority: priority || 'medium',
                    userId,
                },
            });
            res.status(201).json({
                success: true,
                data: goal,
            });
        }
        catch (error) {
            next(error);
        }
    },
    // Update savings goal
    update: async (req, res, next) => {
        try {
            const { id } = req.params;
            const userId = req.user?.userId;
            const { name, description, targetAmount, category, icon, color, deadline, priority, } = req.body;
            if (!userId) {
                throw new AppError_1.AppError('Unauthorized', 401);
            }
            // Check ownership
            const existingGoal = await prisma_1.prisma.savingsGoal.findFirst({
                where: { id, userId },
            });
            if (!existingGoal) {
                throw new AppError_1.AppError('Savings goal not found', 404);
            }
            if (targetAmount && targetAmount <= 0) {
                throw new AppError_1.AppError('Target amount must be greater than 0', 400);
            }
            const goal = await prisma_1.prisma.savingsGoal.update({
                where: { id },
                data: {
                    ...(name !== undefined && { name }),
                    ...(description !== undefined && { description }),
                    ...(targetAmount !== undefined && { targetAmount }),
                    ...(category !== undefined && { category }),
                    ...(icon !== undefined && { icon }),
                    ...(color !== undefined && { color }),
                    ...(deadline !== undefined && { deadline: deadline ? new Date(deadline) : null }),
                    ...(priority !== undefined && { priority }),
                },
            });
            res.json({
                success: true,
                data: goal,
            });
        }
        catch (error) {
            next(error);
        }
    },
    // Delete savings goal
    delete: async (req, res, next) => {
        try {
            const { id } = req.params;
            const userId = req.user?.userId;
            if (!userId) {
                throw new AppError_1.AppError('Unauthorized', 401);
            }
            // Check ownership
            const existingGoal = await prisma_1.prisma.savingsGoal.findFirst({
                where: { id, userId },
            });
            if (!existingGoal) {
                throw new AppError_1.AppError('Savings goal not found', 404);
            }
            await prisma_1.prisma.savingsGoal.delete({
                where: { id },
            });
            res.json({
                success: true,
                message: 'Savings goal deleted successfully',
            });
        }
        catch (error) {
            next(error);
        }
    },
    // Add amount to savings goal
    addAmount: async (req, res, next) => {
        try {
            const { id } = req.params;
            const { amount } = req.body;
            const userId = req.user?.userId;
            if (!userId) {
                throw new AppError_1.AppError('Unauthorized', 401);
            }
            if (!amount || amount <= 0) {
                throw new AppError_1.AppError('Amount must be greater than 0', 400);
            }
            // Check ownership
            const goal = await prisma_1.prisma.savingsGoal.findFirst({
                where: { id, userId },
            });
            if (!goal) {
                throw new AppError_1.AppError('Savings goal not found', 404);
            }
            // Add amount to current savings
            const updatedGoal = await prisma_1.prisma.savingsGoal.update({
                where: { id },
                data: {
                    currentAmount: goal.currentAmount + amount,
                },
            });
            res.json({
                success: true,
                data: updatedGoal,
            });
        }
        catch (error) {
            next(error);
        }
    },
    // Get progress statistics
    getStats: async (req, res, next) => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                throw new AppError_1.AppError('Unauthorized', 401);
            }
            const goals = await prisma_1.prisma.savingsGoal.findMany({
                where: { userId },
            });
            const totalTargetAmount = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
            const totalCurrentAmount = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
            const completedGoals = goals.filter((goal) => goal.currentAmount >= goal.targetAmount).length;
            const progressPercentage = totalTargetAmount > 0 ? (totalCurrentAmount / totalTargetAmount) * 100 : 0;
            res.json({
                success: true,
                data: {
                    totalGoals: goals.length,
                    completedGoals,
                    totalTargetAmount,
                    totalCurrentAmount,
                    progressPercentage,
                    averageProgressPercentage: goals.length > 0
                        ? (goals.reduce((sum, goal) => sum + Math.min((goal.currentAmount / goal.targetAmount) * 100, 100), 0) /
                            goals.length)
                        : 0,
                },
            });
        }
        catch (error) {
            next(error);
        }
    },
};
//# sourceMappingURL=savingsGoal.controller.js.map