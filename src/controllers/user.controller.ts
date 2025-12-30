import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import { AppError } from '../utils/errors/AppError';
import { hashPassword, comparePassword } from '../utils/auth/password';

export const userController = {
  // Get user profile
  getProfile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        throw new AppError('Unauthorized', 401);
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  // Update user profile
  updateProfile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      const { name, email } = req.body;

      if (!userId) {
        throw new AppError('Unauthorized', 401);
      }

      // Validate input
      if (name && name.trim().length === 0) {
        throw new AppError('Name cannot be empty', 400);
      }

      if (email && email.trim().length === 0) {
        throw new AppError('Email cannot be empty', 400);
      }

      // Check if email is already taken by another user
      if (email) {
        const existingUser = await prisma.user.findFirst({
          where: {
            email: email.toLowerCase(),
            NOT: { id: userId },
          },
        });

        if (existingUser) {
          throw new AppError('Email is already in use', 400);
        }
      }

      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          ...(name && { name }),
          ...(email && { email: email.toLowerCase() }),
        },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      res.json({
        success: true,
        data: user,
        message: 'Profile updated successfully',
      });
    } catch (error) {
      next(error);
    }
  },

  // Change password
  changePassword: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      const { currentPassword, newPassword, confirmPassword } = req.body;

      if (!userId) {
        throw new AppError('Unauthorized', 401);
      }

      // Validate input
      if (!currentPassword || !newPassword || !confirmPassword) {
        throw new AppError('All password fields are required', 400);
      }

      if (newPassword.length < 8) {
        throw new AppError('New password must be at least 8 characters', 400);
      }

      if (newPassword !== confirmPassword) {
        throw new AppError('New passwords do not match', 400);
      }

      if (currentPassword === newPassword) {
        throw new AppError('New password must be different from current password', 400);
      }

      // Get user with password
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Verify current password
      const isPasswordValid = await comparePassword(currentPassword, user.password);

      if (!isPasswordValid) {
        throw new AppError('Current password is incorrect', 401);
      }

      // Hash new password
      const hashedPassword = await hashPassword(newPassword);

      // Update password
      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      });

      res.json({
        success: true,
        message: 'Password changed successfully',
      });
    } catch (error) {
      next(error);
    }
  },

  // Delete account
  deleteAccount: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      const { password } = req.body;

      if (!userId) {
        throw new AppError('Unauthorized', 401);
      }

      if (!password) {
        throw new AppError('Password is required to delete account', 400);
      }

      // Get user with password
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Verify password
      const isPasswordValid = await comparePassword(password, user.password);

      if (!isPasswordValid) {
        throw new AppError('Password is incorrect', 401);
      }

      // Delete user (cascade deletes all related data)
      await prisma.user.delete({
        where: { id: userId },
      });

      res.json({
        success: true,
        message: 'Account deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  },
};
