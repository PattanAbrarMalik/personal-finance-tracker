# Test Suite

This directory contains all tests for the backend API.

## Quick Start

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage
```

## Test Files

- `auth.test.ts` - Authentication endpoints (register, login, me)
- `categories.test.ts` - Category CRUD operations
- `transactions.test.ts` - Transaction CRUD and statistics
- `health.test.ts` - Health check endpoint

## Helpers

The `helpers/` directory contains utility functions for tests:
- `test-helpers.ts` - Functions to create test users, categories, transactions

## Adding New Tests

1. Create a new test file: `myfeature.test.ts`
2. Import necessary dependencies
3. Use test helpers to set up data
4. Write descriptive test cases

Example:
```typescript
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../index';
import { createTestUser } from './helpers/test-helpers';

describe('My Feature', () => {
  it('should work correctly', async () => {
    const user = await createTestUser();
    // Your test here
  });
});
```







