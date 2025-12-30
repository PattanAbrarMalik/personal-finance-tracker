"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.savingsGoalService = void 0;
const prisma_1 = require("../utils/prisma");
exports.savingsGoalService = {
    // Get all goals for a user
    async getGoalsByUserId(userId) {
        return prisma_1.prisma.savingsGoal.findMany({
            where: { userId },
            orderBy: [{ priority: 'desc' }, { deadline: 'asc' }, { createdAt: 'desc' }],
        });
    },
    // Get single goal
    async getGoalById(id) {
        return prisma_1.prisma.savingsGoal.findUnique({
            where: { id },
        });
    },
    // Create new goal
    async createGoal(userId, data) {
        return prisma_1.prisma.savingsGoal.create({
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
    async updateGoal(id, data) {
        return prisma_1.prisma.savingsGoal.update({
            where: { id },
            data,
        });
    },
    // Delete goal
    async deleteGoal(id) {
        return prisma_1.prisma.savingsGoal.delete({
            where: { id },
        });
    },
    // Add amount to goal
    async addAmountToGoal(id, amount) {
        const goal = await prisma_1.prisma.savingsGoal.findUnique({ where: { id } });
        if (!goal) {
            throw new Error('Goal not found');
        }
        return prisma_1.prisma.savingsGoal.update({
            where: { id },
            data: {
                currentAmount: goal.currentAmount + amount,
            },
        });
    },
    // Get progress statistics
    async getUserSavingsStats(userId) {
        const goals = await prisma_1.prisma.savingsGoal.findMany({
            where: { userId },
        });
        const totalTargetAmount = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
        const totalCurrentAmount = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
        const completedGoals = goals.filter((goal) => goal.currentAmount >= goal.targetAmount).length;
        const progressPercentage = totalTargetAmount > 0 ? (totalCurrentAmount / totalTargetAmount) * 100 : 0;
        const averageProgressPercentage = goals.length > 0
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
//# sourceMappingURL=savingsGoal.service.js.map