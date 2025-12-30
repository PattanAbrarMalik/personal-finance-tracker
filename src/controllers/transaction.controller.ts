import { Request, Response } from 'express';
import {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionStats,
} from '../services/transaction.service';
import { asyncHandler } from '../middleware/errorHandler.middleware';

export const transactionController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const result = await getTransactions(req.user!.userId, req.query as any);
    res.status(200).json({
      success: true,
      data: result,
    });
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const transaction = await getTransactionById(req.params.id, req.user!.userId);
    res.status(200).json({
      success: true,
      data: { transaction },
    });
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const transaction = await createTransaction(req.user!.userId, req.body);
    res.status(201).json({
      success: true,
      data: { transaction },
    });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const transaction = await updateTransaction(
      req.params.id,
      req.user!.userId,
      req.body
    );
    res.status(200).json({
      success: true,
      data: { transaction },
    });
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    await deleteTransaction(req.params.id, req.user!.userId);
    res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully',
    });
  }),

  getStats: asyncHandler(async (req: Request, res: Response) => {
    const stats = await getTransactionStats(
      req.user!.userId,
      req.query.startDate ? new Date(req.query.startDate as string) : undefined,
      req.query.endDate ? new Date(req.query.endDate as string) : undefined
    );
    res.status(200).json({
      success: true,
      data: { stats },
    });
  }),
};








