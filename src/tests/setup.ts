import { beforeEach, afterAll } from 'vitest';
import { prisma } from '../utils/prisma';

// Clean up database before each test
beforeEach(async () => {
  // Delete all data in reverse order of dependencies
  await prisma.transaction.deleteMany();
  await prisma.budget.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
});

// Close Prisma connection after all tests
afterAll(async () => {
  await prisma.$disconnect();
});


