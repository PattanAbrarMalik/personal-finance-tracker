import { prisma } from '../../utils/prisma';
import { hashPassword } from '../../utils/auth/password';
import { generateToken } from '../../utils/auth/jwt';

export interface TestUser {
  id: string;
  email: string;
  name: string | null;
  password: string;
  token: string;
}

/**
 * Create a test user and return user data with token
 */
export const createTestUser = async (
  email: string = 'test@example.com',
  password: string = 'Test1234',
  name: string = 'Test User'
): Promise<TestUser> => {
  const hashedPassword = await hashPassword(password);
  
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });

  const token = generateToken({
    userId: user.id,
    email: user.email,
  });

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    password, // Return plain password for testing
    token,
  };
};

/**
 * Create a test category
 */
export const createTestCategory = async (
  userId: string,
  name: string = 'Test Category',
  color: string = '#3B82F6'
) => {
  return prisma.category.create({
    data: {
      userId,
      name,
      color,
    },
  });
};

/**
 * Create a test transaction
 */
export const createTestTransaction = async (
  userId: string,
  amount: number = 100.0,
  type: 'INCOME' | 'EXPENSE' = 'EXPENSE',
  categoryId?: string
) => {
  return prisma.transaction.create({
    data: {
      userId,
      amount,
      description: 'Test transaction',
      type,
      categoryId,
      date: new Date(),
    },
    include: {
      category: true,
    },
  });
};








