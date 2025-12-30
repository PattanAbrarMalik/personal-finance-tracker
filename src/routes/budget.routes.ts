import { Router } from 'express';
import { budgetController } from '../controllers/budget.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  idParamSchema,
  createBudgetSchema,
  updateBudgetSchema,
} from '../utils/validation/schemas';

export const budgetRouter = Router();

// All budget routes require authentication
budgetRouter.use(authenticate);

budgetRouter.get('/', budgetController.getAll);
budgetRouter.get(
  '/:id',
  validate({ params: idParamSchema }),
  budgetController.getById
);
budgetRouter.get(
  '/:id/progress',
  validate({ params: idParamSchema }),
  budgetController.getProgress
);
budgetRouter.post(
  '/',
  validate({ body: createBudgetSchema }),
  budgetController.create
);
budgetRouter.put(
  '/:id',
  validate({ params: idParamSchema, body: updateBudgetSchema }),
  budgetController.update
);
budgetRouter.delete(
  '/:id',
  validate({ params: idParamSchema }),
  budgetController.delete
);








