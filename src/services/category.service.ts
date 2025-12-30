import { prisma } from '../utils/prisma';
import { NotFoundError, ValidationError } from '../utils/errors';
import { TransactionType } from '@prisma/client';

export interface CreateCategoryData {
  name: string;
  color?: string;
  icon?: string;
}

export interface UpdateCategoryData {
  name?: string;
  color?: string;
  icon?: string;
}

/**
 * Get all categories for a user
 */
export const getCategories = async (userId: string) => {
  return prisma.category.findMany({
    where: { userId },
    orderBy: { name: 'asc' },
  });
};

/**
 * Get a single category by ID
 */
export const getCategoryById = async (categoryId: string, userId: string) => {
  const category = await prisma.category.findFirst({
    where: {
      id: categoryId,
      userId,
    },
  });

  if (!category) {
    throw new NotFoundError('Category');
  }

  return category;
};

/**
 * Create a new category
 */
export const createCategory = async (userId: string, data: CreateCategoryData) => {
  // Check if category with same name already exists for this user
  const existingCategory = await prisma.category.findFirst({
    where: {
      userId,
      name: data.name,
    },
  });

  if (existingCategory) {
    throw new ValidationError('Category already exists', {
      name: ['A category with this name already exists'],
    });
  }

  return prisma.category.create({
    data: {
      ...data,
      userId,
    },
  });
};

/**
 * Update a category
 */
export const updateCategory = async (
  categoryId: string,
  userId: string,
  data: UpdateCategoryData
) => {
  // Check if category exists and belongs to user
  const category = await getCategoryById(categoryId, userId);

  // If name is being updated, check for duplicates
  if (data.name && data.name !== category.name) {
    const existingCategory = await prisma.category.findFirst({
      where: {
        userId,
        name: data.name,
        NOT: { id: categoryId },
      },
    });

    if (existingCategory) {
      throw new ValidationError('Category already exists', {
        name: ['A category with this name already exists'],
      });
    }
  }

  return prisma.category.update({
    where: { id: categoryId },
    data,
  });
};

/**
 * Delete a category
 */
export const deleteCategory = async (categoryId: string, userId: string) => {
  // Check if category exists and belongs to user
  await getCategoryById(categoryId, userId);

  // Check if category is used in any transactions
  const transactionCount = await prisma.transaction.count({
    where: { categoryId },
  });

  if (transactionCount > 0) {
    throw new ValidationError(
      'Cannot delete category that is used in transactions',
      {
        categoryId: [`Category is used in ${transactionCount} transaction(s)`],
      }
    );
  }

  return prisma.category.delete({
    where: { id: categoryId },
  });
};








