import { Router } from 'express';
import { savingsGoalController } from '../controllers/savingsGoal.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { z } from 'zod';

const router = Router();

// Validation schemas
const createGoalSchema = z.object({
  name: z.string().min(1, 'Goal name is required').max(100),
  description: z.string().optional(),
  targetAmount: z.number().positive('Target amount must be greater than 0'),
  category: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  deadline: z.string().datetime().optional().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
});

const updateGoalSchema = createGoalSchema.partial();

const addAmountSchema = z.object({
  amount: z.number().positive('Amount must be greater than 0'),
});

// Apply authentication middleware to all routes
router.use(authenticate);

// Get all savings goals
router.get('/', savingsGoalController.getAll);

// Get savings goals statistics
router.get('/stats', savingsGoalController.getStats);

// Get single goal
router.get('/:id', savingsGoalController.getById);

// Create goal
router.post('/', validate({ body: createGoalSchema }), savingsGoalController.create);

// Update goal
router.put('/:id', validate({ body: updateGoalSchema }), savingsGoalController.update);

// Delete goal
router.delete('/:id', savingsGoalController.delete);

// Add amount to goal
router.post('/:id/add', validate({ body: addAmountSchema }), savingsGoalController.addAmount);

export default router;
