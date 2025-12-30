"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const prisma_1 = require("../utils/prisma");
const AppError_1 = require("../utils/errors/AppError");
const password_1 = require("../utils/auth/password");
exports.userController = {
    // Get user profile
    getProfile: async (req, res, next) => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                throw new AppError_1.AppError('Unauthorized', 401);
            }
            const user = await prisma_1.prisma.user.findUnique({
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
                throw new AppError_1.AppError('User not found', 404);
            }
            res.json({
                success: true,
                data: user,
            });
        }
        catch (error) {
            next(error);
        }
    },
    // Update user profile
    updateProfile: async (req, res, next) => {
        try {
            const userId = req.user?.userId;
            const { name, email } = req.body;
            if (!userId) {
                throw new AppError_1.AppError('Unauthorized', 401);
            }
            // Validate input
            if (name && name.trim().length === 0) {
                throw new AppError_1.AppError('Name cannot be empty', 400);
            }
            if (email && email.trim().length === 0) {
                throw new AppError_1.AppError('Email cannot be empty', 400);
            }
            // Check if email is already taken by another user
            if (email) {
                const existingUser = await prisma_1.prisma.user.findFirst({
                    where: {
                        email: email.toLowerCase(),
                        NOT: { id: userId },
                    },
                });
                if (existingUser) {
                    throw new AppError_1.AppError('Email is already in use', 400);
                }
            }
            const user = await prisma_1.prisma.user.update({
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
        }
        catch (error) {
            next(error);
        }
    },
    // Change password
    changePassword: async (req, res, next) => {
        try {
            const userId = req.user?.userId;
            const { currentPassword, newPassword, confirmPassword } = req.body;
            if (!userId) {
                throw new AppError_1.AppError('Unauthorized', 401);
            }
            // Validate input
            if (!currentPassword || !newPassword || !confirmPassword) {
                throw new AppError_1.AppError('All password fields are required', 400);
            }
            if (newPassword.length < 8) {
                throw new AppError_1.AppError('New password must be at least 8 characters', 400);
            }
            if (newPassword !== confirmPassword) {
                throw new AppError_1.AppError('New passwords do not match', 400);
            }
            if (currentPassword === newPassword) {
                throw new AppError_1.AppError('New password must be different from current password', 400);
            }
            // Get user with password
            const user = await prisma_1.prisma.user.findUnique({
                where: { id: userId },
            });
            if (!user) {
                throw new AppError_1.AppError('User not found', 404);
            }
            // Verify current password
            const isPasswordValid = await (0, password_1.comparePassword)(currentPassword, user.password);
            if (!isPasswordValid) {
                throw new AppError_1.AppError('Current password is incorrect', 401);
            }
            // Hash new password
            const hashedPassword = await (0, password_1.hashPassword)(newPassword);
            // Update password
            await prisma_1.prisma.user.update({
                where: { id: userId },
                data: { password: hashedPassword },
            });
            res.json({
                success: true,
                message: 'Password changed successfully',
            });
        }
        catch (error) {
            next(error);
        }
    },
    // Delete account
    deleteAccount: async (req, res, next) => {
        try {
            const userId = req.user?.userId;
            const { password } = req.body;
            if (!userId) {
                throw new AppError_1.AppError('Unauthorized', 401);
            }
            if (!password) {
                throw new AppError_1.AppError('Password is required to delete account', 400);
            }
            // Get user with password
            const user = await prisma_1.prisma.user.findUnique({
                where: { id: userId },
            });
            if (!user) {
                throw new AppError_1.AppError('User not found', 404);
            }
            // Verify password
            const isPasswordValid = await (0, password_1.comparePassword)(password, user.password);
            if (!isPasswordValid) {
                throw new AppError_1.AppError('Password is incorrect', 401);
            }
            // Delete user (cascade deletes all related data)
            await prisma_1.prisma.user.delete({
                where: { id: userId },
            });
            res.json({
                success: true,
                message: 'Account deleted successfully',
            });
        }
        catch (error) {
            next(error);
        }
    },
};
//# sourceMappingURL=user.controller.js.map