import { Request, Response } from 'express';
import {
  getBudgets,
  getBudgetById,
  createBudget,
  updateBudget,
  deleteBudget,
  getBudgetProgress,
} from '../services/budget.service';
import { asyncHandler } from '../middleware/errorHandler.middleware';

export const budgetController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const budgets = await getBudgets(req.user!.userId);
    
    // Calculate spent amount for each budget
    const budgetsWithSpent = await Promise.all(
      budgets.map(async (budget) => {
        const progress = await getBudgetProgress(budget.id, req.user!.userId);
        return {
          ...budget,
          spent: progress.spent,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: budgetsWithSpent,
    });
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const budget = await getBudgetById(req.params.id, req.user!.userId);
    res.status(200).json({
      success: true,
      data: { budget },
    });
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const budget = await createBudget(req.user!.userId, req.body);
    res.status(201).json({
      success: true,
      data: { budget },
    });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const budget = await updateBudget(req.params.id, req.user!.userId, req.body);
    res.status(200).json({
      success: true,
      data: { budget },
    });
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    await deleteBudget(req.params.id, req.user!.userId);
    res.status(200).json({
      success: true,
      message: 'Budget deleted successfully',
    });
  }),

  getProgress: asyncHandler(async (req: Request, res: Response) => {
    const progress = await getBudgetProgress(req.params.id, req.user!.userId);
    res.status(200).json({
      success: true,
      data: { progress },
    });
  }),
};








