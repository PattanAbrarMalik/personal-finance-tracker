import { PrismaClient, TransactionType, BudgetPeriod } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create a test user
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
      password: 'hashed_password_here', // In production, this should be properly hashed
    },
  });

  console.log('✅ Created user:', user.email);

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { userId_name: { userId: user.id, name: 'Food' } },
      update: {},
      create: {
        name: 'Food',
        color: '#EF4444',
        icon: '🍔',
        userId: user.id,
      },
    }),
    prisma.category.upsert({
      where: { userId_name: { userId: user.id, name: 'Transport' } },
      update: {},
      create: {
        name: 'Transport',
        color: '#3B82F6',
        icon: '🚗',
        userId: user.id,
      },
    }),
    prisma.category.upsert({
      where: { userId_name: { userId: user.id, name: 'Entertainment' } },
      update: {},
      create: {
        name: 'Entertainment',
        color: '#10B981',
        icon: '🎬',
        userId: user.id,
      },
    }),
    prisma.category.upsert({
      where: { userId_name: { userId: user.id, name: 'Salary' } },
      update: {},
      create: {
        name: 'Salary',
        color: '#F59E0B',
        icon: '💰',
        userId: user.id,
      },
    }),
  ]);

  console.log('✅ Created categories:', categories.length);

  // Create sample transactions
  const transactions = await Promise.all([
    prisma.transaction.create({
      data: {
        amount: 1500.00,
        description: 'Monthly Salary',
        type: TransactionType.INCOME,
        categoryId: categories[3].id,
        userId: user.id,
        date: new Date(),
      },
    }),
    prisma.transaction.create({
      data: {
        amount: -45.50,
        description: 'Grocery Shopping',
        type: TransactionType.EXPENSE,
        categoryId: categories[0].id,
        userId: user.id,
        date: new Date(),
      },
    }),
    prisma.transaction.create({
      data: {
        amount: -25.00,
        description: 'Uber Ride',
        type: TransactionType.EXPENSE,
        categoryId: categories[1].id,
        userId: user.id,
        date: new Date(),
      },
    }),
  ]);

  console.log('✅ Created transactions:', transactions.length);

  // Create a sample budget
  const budget = await prisma.budget.create({
    data: {
      name: 'Monthly Food Budget',
      amount: 500.00,
      period: BudgetPeriod.MONTHLY,
      categoryId: categories[0].id,
      userId: user.id,
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    },
  });

  console.log('✅ Created budget:', budget.name);

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

