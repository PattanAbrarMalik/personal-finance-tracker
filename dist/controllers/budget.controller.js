"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.budgetController = void 0;
const budget_service_1 = require("../services/budget.service");
const errorHandler_middleware_1 = require("../middleware/errorHandler.middleware");
exports.budgetController = {
    getAll: (0, errorHandler_middleware_1.asyncHandler)(async (req, res) => {
        const budgets = await (0, budget_service_1.getBudgets)(req.user.userId);
        // Calculate spent amount for each budget
        const budgetsWithSpent = await Promise.all(budgets.map(async (budget) => {
            const progress = await (0, budget_service_1.getBudgetProgress)(budget.id, req.user.userId);
            return {
                ...budget,
                spent: progress.spent,
            };
        }));
        res.status(200).json({
            success: true,
            data: budgetsWithSpent,
        });
    }),
    getById: (0, errorHandler_middleware_1.asyncHandler)(async (req, res) => {
        const budget = await (0, budget_service_1.getBudgetById)(req.params.id, req.user.userId);
        res.status(200).json({
            success: true,
            data: { budget },
        });
    }),
    create: (0, errorHandler_middleware_1.asyncHandler)(async (req, res) => {
        const budget = await (0, budget_service_1.createBudget)(req.user.userId, req.body);
        res.status(201).json({
            success: true,
            data: { budget },
        });
    }),
    update: (0, errorHandler_middleware_1.asyncHandler)(async (req, res) => {
        const budget = await (0, budget_service_1.updateBudget)(req.params.id, req.user.userId, req.body);
        res.status(200).json({
            success: true,
            data: { budget },
        });
    }),
    delete: (0, errorHandler_middleware_1.asyncHandler)(async (req, res) => {
        await (0, budget_service_1.deleteBudget)(req.params.id, req.user.userId);
        res.status(200).json({
            success: true,
            message: 'Budget deleted successfully',
        });
    }),
    getProgress: (0, errorHandler_middleware_1.asyncHandler)(async (req, res) => {
        const progress = await (0, budget_service_1.getBudgetProgress)(req.params.id, req.user.userId);
        res.status(200).json({
            success: true,
            data: { progress },
        });
    }),
};
//# sourceMappingURL=budget.controller.js.map