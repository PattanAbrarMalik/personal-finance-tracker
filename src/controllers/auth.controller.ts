import { Request, Response } from 'express';
import { register, login, getCurrentUser, googleLogin, appleLogin } from '../services/auth.service';
import { asyncHandler } from '../middleware/errorHandler.middleware';

export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const result = await register(req.body);
    res.status(201).json({
      success: true,
      data: result,
    });
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const result = await login(req.body);
    res.status(200).json({
      success: true,
      data: result,
    });
  }),

  me: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Unauthorized',
          statusCode: 401,
        },
      });
    }

    const user = await getCurrentUser(req.user.userId);
    res.status(200).json({
      success: true,
      data: { user },
    });
  }),

  googleLogin: asyncHandler(async (req: Request, res: Response) => {
    const result = await googleLogin(req.body);
    res.status(200).json({
      success: true,
      data: result,
    });
  }),

  appleLogin: asyncHandler(async (req: Request, res: Response) => {
    const result = await appleLogin(req.body);
    res.status(200).json({
      success: true,
      data: result,
    });
  }),
};








