import { Router } from 'express';
import { transactionController } from '../controllers/transaction.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  idParamSchema,
  createTransactionSchema,
  updateTransactionSchema,
  transactionQuerySchema,
} from '../utils/validation/schemas';

export const transactionRouter = Router();

// All transaction routes require authentication
transactionRouter.use(authenticate);

transactionRouter.get(
  '/',
  validate({ query: transactionQuerySchema }),
  transactionController.getAll
);
transactionRouter.get(
  '/stats',
  transactionController.getStats
);
transactionRouter.get(
  '/:id',
  validate({ params: idParamSchema }),
  transactionController.getById
);
transactionRouter.post(
  '/',
  validate({ body: createTransactionSchema }),
  transactionController.create
);
transactionRouter.put(
  '/:id',
  validate({ params: idParamSchema, body: updateTransactionSchema }),
  transactionController.update
);
transactionRouter.delete(
  '/:id',
  validate({ params: idParamSchema }),
  transactionController.delete
);








