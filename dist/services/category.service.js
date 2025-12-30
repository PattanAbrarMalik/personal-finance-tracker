"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategoryById = exports.getCategories = void 0;
const prisma_1 = require("../utils/prisma");
const errors_1 = require("../utils/errors");
/**
 * Get all categories for a user
 */
const getCategories = async (userId) => {
    return prisma_1.prisma.category.findMany({
        where: { userId },
        orderBy: { name: 'asc' },
    });
};
exports.getCategories = getCategories;
/**
 * Get a single category by ID
 */
const getCategoryById = async (categoryId, userId) => {
    const category = await prisma_1.prisma.category.findFirst({
        where: {
            id: categoryId,
            userId,
        },
    });
    if (!category) {
        throw new errors_1.NotFoundError('Category');
    }
    return category;
};
exports.getCategoryById = getCategoryById;
/**
 * Create a new category
 */
const createCategory = async (userId, data) => {
    // Check if category with same name already exists for this user
    const existingCategory = await prisma_1.prisma.category.findFirst({
        where: {
            userId,
            name: data.name,
        },
    });
    if (existingCategory) {
        throw new errors_1.ValidationError('Category already exists', {
            name: ['A category with this name already exists'],
        });
    }
    return prisma_1.prisma.category.create({
        data: {
            ...data,
            userId,
        },
    });
};
exports.createCategory = createCategory;
/**
 * Update a category
 */
const updateCategory = async (categoryId, userId, data) => {
    // Check if category exists and belongs to user
    const category = await (0, exports.getCategoryById)(categoryId, userId);
    // If name is being updated, check for duplicates
    if (data.name && data.name !== category.name) {
        const existingCategory = await prisma_1.prisma.category.findFirst({
            where: {
                userId,
                name: data.name,
                NOT: { id: categoryId },
            },
        });
        if (existingCategory) {
            throw new errors_1.ValidationError('Category already exists', {
                name: ['A category with this name already exists'],
            });
        }
    }
    return prisma_1.prisma.category.update({
        where: { id: categoryId },
        data,
    });
};
exports.updateCategory = updateCategory;
/**
 * Delete a category
 */
const deleteCategory = async (categoryId, userId) => {
    // Check if category exists and belongs to user
    await (0, exports.getCategoryById)(categoryId, userId);
    // Check if category is used in any transactions
    const transactionCount = await prisma_1.prisma.transaction.count({
        where: { categoryId },
    });
    if (transactionCount > 0) {
        throw new errors_1.ValidationError('Cannot delete category that is used in transactions', {
            categoryId: [`Category is used in ${transactionCount} transaction(s)`],
        });
    }
    return prisma_1.prisma.category.delete({
        where: { id: categoryId },
    });
};
exports.deleteCategory = deleteCategory;
//# sourceMappingURL=category.service.js.map