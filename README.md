# Personal Finance Tracker - Backend API

Backend API for the Personal Finance Tracker application built with Node.js, TypeScript, and Express.

## Features

- RESTful API architecture
- TypeScript for type safety
- Express.js web framework
- JWT-based authentication
- Prisma ORM with SQLite/PostgreSQL support
- Security middleware (Helmet, CORS)
- Input validation with Zod
- Comprehensive error handling
- Structured logging
- Unit and integration tests with Vitest
- Environment variable configuration
- ESLint and Prettier for code quality

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and configure your environment variables.

3. **Set up database:**
   ```bash
   npm run db:migrate
   ```
   This creates the database and runs migrations.

4. **Generate Prisma Client:**
   ```bash
   npm run db:generate
   ```

5. **Run in development mode:**
   ```bash
   npm run dev
   ```
   The server will start on `http://localhost:3000` (or the PORT specified in `.env`).

6. **Build for production:**
   ```bash
   npm run build
   ```

7. **Start production server:**
   ```bash
   npm start
   ```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:ui` - Run tests with UI
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint with auto-fix
- `npm run format` - Format code with Prettier
- `npm run db:generate` - Generate Prisma Client
- `npm run db:migrate` - Create and apply migrations
- `npm run db:studio` - Open Prisma Studio (database GUI)
- `npm run db:seed` - Seed database with sample data

## API Documentation

See [API.md](./API.md) for complete API documentation.

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Express middleware (auth, validation, error handling)
│   ├── models/          # Data models (Prisma schema in prisma/)
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── tests/           # Test files
│   ├── utils/           # Utility functions (auth, logger, errors, validation)
│   └── index.ts         # Application entry point
├── prisma/
│   └── schema.prisma    # Database schema
├── dist/                # Compiled JavaScript (generated)
├── .env.example         # Environment variables template
├── .eslintrc.json       # ESLint configuration
├── .prettierrc.json     # Prettier configuration
├── vitest.config.ts     # Vitest configuration
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
└── README.md            # This file
```

## Testing

See [TESTING.md](./TESTING.md) for detailed testing guide.

Run tests:
```bash
npm test
```

## Authentication

See [AUTHENTICATION.md](./AUTHENTICATION.md) for authentication guide.

## Database

See [DATABASE.md](./DATABASE.md) for database setup and usage guide.

## Error Handling

See [ERROR_HANDLING.md](./ERROR_HANDLING.md) for error handling documentation.

## Development

The project uses TypeScript for type safety. Make sure to:
- Add proper types to all functions and variables
- Follow the existing folder structure for new features
- Write clean, maintainable code
- Run linting and formatting before committing
- Write tests for new features

## License

ISC
