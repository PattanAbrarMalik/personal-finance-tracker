import { z } from 'zod';
export declare const idParamSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export declare const paginationQuerySchema: z.ZodObject<{
    page: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string>>;
    limit: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string>>;
}, z.core.$strip>;
export declare const emailSchema: z.ZodString;
export declare const passwordSchema: z.ZodString;
export declare const createTransactionSchema: z.ZodObject<{
    amount: z.ZodNumber;
    description: z.ZodString;
    type: z.ZodEnum<{
        INCOME: "INCOME";
        EXPENSE: "EXPENSE";
    }>;
    date: z.ZodPipe<z.ZodUnion<[z.ZodString, z.ZodDate]>, z.ZodTransform<Date, string | Date>>;
    categoryId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateTransactionSchema: z.ZodObject<{
    amount: z.ZodOptional<z.ZodNumber>;
    description: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodEnum<{
        INCOME: "INCOME";
        EXPENSE: "EXPENSE";
    }>>;
    date: z.ZodOptional<z.ZodPipe<z.ZodUnion<[z.ZodString, z.ZodDate]>, z.ZodTransform<Date, string | Date>>>;
    categoryId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export declare const transactionQuerySchema: z.ZodObject<{
    type: z.ZodOptional<z.ZodEnum<{
        INCOME: "INCOME";
        EXPENSE: "EXPENSE";
    }>>;
    categoryId: z.ZodOptional<z.ZodString>;
    startDate: z.ZodPipe<z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodString]>>, z.ZodTransform<Date, string>>;
    endDate: z.ZodPipe<z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodString]>>, z.ZodTransform<Date, string>>;
    page: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string>>;
    limit: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string>>;
}, z.core.$strip>;
export declare const createCategorySchema: z.ZodObject<{
    name: z.ZodString;
    color: z.ZodOptional<z.ZodString>;
    icon: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateCategorySchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    color: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    icon: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export declare const createBudgetSchema: z.ZodObject<{
    name: z.ZodString;
    amount: z.ZodNumber;
    period: z.ZodEnum<{
        WEEKLY: "WEEKLY";
        MONTHLY: "MONTHLY";
        YEARLY: "YEARLY";
    }>;
    categoryId: z.ZodOptional<z.ZodString>;
    startDate: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodString, z.ZodDate]>, z.ZodTransform<Date, string | Date>>;
    endDate: z.ZodPipe<z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodString, z.ZodDate]>>, z.ZodTransform<Date, string | Date>>;
}, z.core.$strip>;
export declare const updateBudgetSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    amount: z.ZodOptional<z.ZodNumber>;
    period: z.ZodOptional<z.ZodEnum<{
        WEEKLY: "WEEKLY";
        MONTHLY: "MONTHLY";
        YEARLY: "YEARLY";
    }>>;
    categoryId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    startDate: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodString, z.ZodDate]>, z.ZodTransform<Date, string | Date>>>;
    endDate: z.ZodOptional<z.ZodPipe<z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodString, z.ZodDate]>>, z.ZodTransform<Date, string | Date>>>;
}, z.core.$strip>;
export declare const registerSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=schemas.d.ts.map