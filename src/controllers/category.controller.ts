import { Request, Response } from 'express';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../services/category.service';
import { asyncHandler } from '../middleware/errorHandler.middleware';

export const categoryController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const categories = await getCategories(req.user!.userId);
    res.status(200).json({
      success: true,
      data: { categories },
    });
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const category = await getCategoryById(req.params.id, req.user!.userId);
    res.status(200).json({
      success: true,
      data: { category },
    });
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const category = await createCategory(req.user!.userId, req.body);
    res.status(201).json({
      success: true,
      data: { category },
    });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const category = await updateCategory(req.params.id, req.user!.userId, req.body);
    res.status(200).json({
      success: true,
      data: { category },
    });
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    await deleteCategory(req.params.id, req.user!.userId);
    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  }),
};








