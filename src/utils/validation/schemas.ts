import { z } from 'zod';

// Common validation schemas
export const idParamSchema = z.object({
  id: z.string().uuid('Invalid ID format'),
});

export const paginationQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).optional().transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z.string().regex(/^\d+$/).optional().transform((val) => (val ? parseInt(val, 10) : 10)),
});

export const emailSchema = z.string().email('Invalid email format');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

// Transaction schemas
export const createTransactionSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  description: z.string().min(1, 'Description is required').max(500, 'Description too long'),
  type: z.enum(['INCOME', 'EXPENSE'], { message: 'Type must be either INCOME or EXPENSE' }),
  date: z.string().datetime().or(z.date()).transform((val) => (typeof val === 'string' ? new Date(val) : val)),
  categoryId: z.string().uuid('Invalid category ID').optional(),
});

export const updateTransactionSchema = createTransactionSchema.partial();

export const transactionQuerySchema = z.object({
  type: z.enum(['INCOME', 'EXPENSE']).optional(),
  categoryId: z.string().uuid().optional(),
  startDate: z
    .union([z.string().datetime(), z.string()])
    .optional()
    .transform((val) => val ? new Date(val) : undefined),
  endDate: z
    .union([z.string().datetime(), z.string()])
    .optional()
    .transform((val) => val ? new Date(val) : undefined),
  page: z.string().regex(/^\d+$/).optional().transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z.string().regex(/^\d+$/).optional().transform((val) => (val ? parseInt(val, 10) : 50)),
});

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100, 'Category name too long'),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format').optional(),
  icon: z.string().optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

// Budget schemas
export const createBudgetSchema = z.object({
  name: z.string().min(1, 'Budget name is required').max(100, 'Budget name too long'),
  amount: z.number().positive('Amount must be positive'),
  period: z.enum(['WEEKLY', 'MONTHLY', 'YEARLY'], { message: 'Period must be WEEKLY, MONTHLY, or YEARLY' }),
  categoryId: z.string().uuid('Invalid category ID').optional(),
  startDate: z
    .union([z.string().datetime(), z.string(), z.date()])
    .transform((val) => {
      if (val instanceof Date) return val;
      return new Date(val);
    }),
  endDate: z
    .union([z.string().datetime(), z.string(), z.date()])
    .optional()
    .transform((val) => {
      if (!val) return undefined;
      if (val instanceof Date) return val;
      return new Date(val);
    }),
});

export const updateBudgetSchema = createBudgetSchema.partial();

// Auth schemas
export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z.string().min(1, 'Name is required').max(100, 'Name too long').optional(),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

