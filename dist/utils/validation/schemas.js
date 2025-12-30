"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = exports.updateBudgetSchema = exports.createBudgetSchema = exports.updateCategorySchema = exports.createCategorySchema = exports.transactionQuerySchema = exports.updateTransactionSchema = exports.createTransactionSchema = exports.passwordSchema = exports.emailSchema = exports.paginationQuerySchema = exports.idParamSchema = void 0;
const zod_1 = require("zod");
// Common validation schemas
exports.idParamSchema = zod_1.z.object({
    id: zod_1.z.string().uuid('Invalid ID format'),
});
exports.paginationQuerySchema = zod_1.z.object({
    page: zod_1.z.string().regex(/^\d+$/).optional().transform((val) => (val ? parseInt(val, 10) : 1)),
    limit: zod_1.z.string().regex(/^\d+$/).optional().transform((val) => (val ? parseInt(val, 10) : 10)),
});
exports.emailSchema = zod_1.z.string().email('Invalid email format');
exports.passwordSchema = zod_1.z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number');
// Transaction schemas
exports.createTransactionSchema = zod_1.z.object({
    amount: zod_1.z.number().positive('Amount must be positive'),
    description: zod_1.z.string().min(1, 'Description is required').max(500, 'Description too long'),
    type: zod_1.z.enum(['INCOME', 'EXPENSE'], { message: 'Type must be either INCOME or EXPENSE' }),
    date: zod_1.z.string().datetime().or(zod_1.z.date()).transform((val) => (typeof val === 'string' ? new Date(val) : val)),
    categoryId: zod_1.z.string().uuid('Invalid category ID').optional(),
});
exports.updateTransactionSchema = exports.createTransactionSchema.partial();
exports.transactionQuerySchema = zod_1.z.object({
    type: zod_1.z.enum(['INCOME', 'EXPENSE']).optional(),
    categoryId: zod_1.z.string().uuid().optional(),
    startDate: zod_1.z
        .union([zod_1.z.string().datetime(), zod_1.z.string()])
        .optional()
        .transform((val) => val ? new Date(val) : undefined),
    endDate: zod_1.z
        .union([zod_1.z.string().datetime(), zod_1.z.string()])
        .optional()
        .transform((val) => val ? new Date(val) : undefined),
    page: zod_1.z.string().regex(/^\d+$/).optional().transform((val) => (val ? parseInt(val, 10) : 1)),
    limit: zod_1.z.string().regex(/^\d+$/).optional().transform((val) => (val ? parseInt(val, 10) : 50)),
});
exports.createCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Category name is required').max(100, 'Category name too long'),
    color: zod_1.z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format').optional(),
    icon: zod_1.z.string().optional(),
});
exports.updateCategorySchema = exports.createCategorySchema.partial();
// Budget schemas
exports.createBudgetSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Budget name is required').max(100, 'Budget name too long'),
    amount: zod_1.z.number().positive('Amount must be positive'),
    period: zod_1.z.enum(['WEEKLY', 'MONTHLY', 'YEARLY'], { message: 'Period must be WEEKLY, MONTHLY, or YEARLY' }),
    categoryId: zod_1.z.string().uuid('Invalid category ID').optional(),
    startDate: zod_1.z
        .union([zod_1.z.string().datetime(), zod_1.z.string(), zod_1.z.date()])
        .transform((val) => {
        if (val instanceof Date)
            return val;
        return new Date(val);
    }),
    endDate: zod_1.z
        .union([zod_1.z.string().datetime(), zod_1.z.string(), zod_1.z.date()])
        .optional()
        .transform((val) => {
        if (!val)
            return undefined;
        if (val instanceof Date)
            return val;
        return new Date(val);
    }),
});
exports.updateBudgetSchema = exports.createBudgetSchema.partial();
// Auth schemas
exports.registerSchema = zod_1.z.object({
    email: exports.emailSchema,
    password: exports.passwordSchema,
    name: zod_1.z.string().min(1, 'Name is required').max(100, 'Name too long').optional(),
});
exports.loginSchema = zod_1.z.object({
    email: exports.emailSchema,
    password: zod_1.z.string().min(1, 'Password is required'),
});
//# sourceMappingURL=schemas.js.map