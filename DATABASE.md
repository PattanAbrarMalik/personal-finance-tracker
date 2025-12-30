# Database Setup Guide

This project uses [Prisma](https://www.prisma.io/) as the ORM with SQLite for development (can be easily switched to PostgreSQL for production).

## Database Schema

The database includes the following models:

- **User** - Application users with authentication
- **Category** - Transaction categories (e.g., Food, Transport, Entertainment)
- **Transaction** - Income and expense transactions
- **Budget** - Budget tracking with periods (weekly, monthly, yearly)

## Setup

### 1. Install Dependencies

Dependencies are already installed:
- `@prisma/client` - Prisma Client for database access
- `prisma` - Prisma CLI for migrations and schema management

### 2. Configure Database URL

The database URL is configured in `.env`:

```env
DATABASE_URL="file:./dev.db"
```

For PostgreSQL in production:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/finance_tracker?schema=public"
```

### 3. Generate Prisma Client

After modifying the schema, generate the Prisma Client:

```bash
npm run db:generate
```

Or use Prisma directly:
```bash
npx prisma generate
```

### 4. Run Migrations

Create and apply database migrations:

```bash
npm run db:migrate
```

This will:
- Create migration files
- Apply migrations to the database
- Regenerate Prisma Client

### 5. Seed the Database (Optional)

Populate the database with sample data:

```bash
npm run db:seed
```

## Available Scripts

- `npm run db:generate` - Generate Prisma Client from schema
- `npm run db:migrate` - Create and apply migrations
- `npm run db:migrate:deploy` - Apply migrations (production)
- `npm run db:studio` - Open Prisma Studio (database GUI)
- `npm run db:seed` - Seed database with sample data

## Using Prisma Client

Import and use Prisma Client in your code:

```typescript
import { prisma } from '../utils/prisma';

// Example: Get all transactions for a user
const transactions = await prisma.transaction.findMany({
  where: { userId: 'user-id' },
  include: { category: true },
});

// Example: Create a transaction
const transaction = await prisma.transaction.create({
  data: {
    amount: 100.00,
    description: 'Grocery shopping',
    type: 'EXPENSE',
    userId: 'user-id',
    categoryId: 'category-id',
  },
});
```

## Prisma Studio

Open Prisma Studio to view and edit data in a visual interface:

```bash
npm run db:studio
```

This opens a web interface at `http://localhost:5555` where you can browse and edit your database.

## Migration Workflow

1. **Modify schema** - Edit `prisma/schema.prisma`
2. **Create migration** - Run `npm run db:migrate`
3. **Name migration** - Give it a descriptive name
4. **Apply migration** - Prisma applies it automatically
5. **Generate client** - Prisma Client is regenerated automatically

## Schema Models

### User
- `id` - UUID (primary key)
- `email` - Unique email address
- `name` - User's name (optional)
- `password` - Hashed password
- `createdAt`, `updatedAt` - Timestamps

### Category
- `id` - UUID (primary key)
- `name` - Category name
- `color` - Hex color code (optional)
- `icon` - Icon identifier (optional)
- `userId` - Foreign key to User
- Unique constraint on (userId, name)

### Transaction
- `id` - UUID (primary key)
- `amount` - Transaction amount (positive or negative)
- `description` - Transaction description
- `type` - INCOME or EXPENSE
- `date` - Transaction date
- `categoryId` - Foreign key to Category (optional)
- `userId` - Foreign key to User
- Indexed on (userId, date) and (userId, type)

### Budget
- `id` - UUID (primary key)
- `name` - Budget name
- `amount` - Budget amount
- `period` - WEEKLY, MONTHLY, or YEARLY
- `categoryId` - Foreign key to Category (optional)
- `userId` - Foreign key to User
- `startDate` - Budget start date
- `endDate` - Budget end date (optional)
- Indexed on (userId, startDate)

## Switching to PostgreSQL

1. Update `schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. Update `.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/finance_tracker?schema=public"
```

3. Run migrations:
```bash
npm run db:migrate
```

## Best Practices

1. **Always run migrations** - Don't manually edit the database
2. **Review migration files** - Check generated SQL before applying
3. **Use transactions** - For complex operations
4. **Handle errors** - Prisma throws specific error types
5. **Use relations** - Leverage Prisma's relation API
6. **Index appropriately** - Add indexes for frequently queried fields

