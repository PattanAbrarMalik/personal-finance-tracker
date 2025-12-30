/**
 * Database seeding utilities for development
 */

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const categories = [
  { name: 'Food & Dining', icon: '🍔', color: '#FF6B6B' },
  { name: 'Transportation', icon: '🚗', color: '#4ECDC4' },
  { name: 'Entertainment', icon: '🎬', color: '#45B7D1' },
  { name: 'Shopping', icon: '🛍️', color: '#FFA07A' },
  { name: 'Health & Fitness', icon: '💪', color: '#98D8C8' },
  { name: 'Utilities', icon: '⚡', color: '#F7DC6F' },
  { name: 'Travel', icon: '✈️', color: '#BB8FCE' },
  { name: 'Subscriptions', icon: '🔄', color: '#85C1E2' },
];

export async function seedDatabase() {
  try {
    console.log('Starting database seed...');

    // Create test user
    const hashedPassword = await bcrypt.hash('TestPassword123!', 10);
    const user = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        email: 'test@example.com',
        name: 'Test User',
        password: hashedPassword,
        twoFactorEnabled: false,
      },
    });

    console.log('Created user:', user.id);

    // Create categories
    const createdCategories = await Promise.all(
      categories.map(cat =>
        prisma.category.upsert({
          where: {
            userId_name: {
              userId: user.id,
              name: cat.name,
            },
          },
          update: {},
          create: {
            userId: user.id,
            name: cat.name,
            icon: cat.icon,
            color: cat.color,
          },
        })
      )
    );

    console.log('Created categories:', createdCategories.length);

    // Create sample transactions
    const now = new Date();
    const transactions = [
      {
        categoryId: createdCategories[0].id,
        amount: 25.50,
        description: 'Lunch at downtown cafe',
        type: 'expense' as const,
        date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        categoryId: createdCategories[1].id,
        amount: 45.00,
        description: 'Gas refill',
        type: 'expense' as const,
        date: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        categoryId: createdCategories[4].id,
        amount: 75.00,
        description: 'Gym membership',
        type: 'expense' as const,
        date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        categoryId: createdCategories[2].id,
        amount: 60.00,
        description: 'Movie tickets',
        type: 'expense' as const,
        date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      },
    ];

    const createdTransactions = await Promise.all(
      transactions.map(tx =>
        prisma.transaction.create({
          data: {
            ...tx,
            userId: user.id,
          },
        })
      )
    );

    console.log('Created transactions:', createdTransactions.length);

    // Create budgets
    const budgets = await Promise.all(
      createdCategories.slice(0, 3).map(cat =>
        prisma.budget.upsert({
          where: {
            userId_categoryId: {
              userId: user.id,
              categoryId: cat.id,
            },
          },
          update: {},
          create: {
            userId: user.id,
            categoryId: cat.id,
            amount: 200,
            period: 'monthly',
          },
        })
      )
    );

    console.log('Created budgets:', budgets.length);

    // Create savings goals
    const goals = await Promise.all([
      prisma.savingsGoal.upsert({
        where: {
          userId_name: {
            userId: user.id,
            name: 'Emergency Fund',
          },
        },
        update: {},
        create: {
          userId: user.id,
          name: 'Emergency Fund',
          targetAmount: 5000,
          currentAmount: 1500,
          deadline: new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000),
          priority: 'high',
        },
      }),
      prisma.savingsGoal.upsert({
        where: {
          userId_name: {
            userId: user.id,
            name: 'Vacation',
          },
        },
        update: {},
        create: {
          userId: user.id,
          name: 'Vacation',
          targetAmount: 3000,
          currentAmount: 800,
          deadline: new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000),
          priority: 'medium',
        },
      }),
    ]);

    console.log('Created savings goals:', goals.length);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run seed if this file is executed directly
if (require.main === module) {
  seedDatabase().catch(console.error);
}
