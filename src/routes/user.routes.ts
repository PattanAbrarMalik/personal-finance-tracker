import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { z } from 'zod';

const router = Router();

// Validation schemas
const updateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1),
});

const deleteAccountSchema = z.object({
  password: z.string().min(1),
});

// All routes require authentication
router.use(authenticate);

// Get user profile
router.get('/profile', userController.getProfile);

// Update user profile
router.put('/profile', validate({ body: updateProfileSchema }), userController.updateProfile);

// Change password
router.post('/change-password', validate({ body: changePasswordSchema }), userController.changePassword);

// Delete account
router.delete('/account', validate({ body: deleteAccountSchema }), userController.deleteAccount);

export default router;
