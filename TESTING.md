# Testing Guide

This project uses Vitest for unit and integration testing, along with Supertest for API endpoint testing.

## Setup

Dependencies are already installed. The test configuration is in `vitest.config.ts`.

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run tests with coverage
```bash
npm run test:coverage
```

### Run tests with UI
```bash
npm run test:ui
```

## Test Structure

```
src/tests/
├── setup.ts                 # Test setup and teardown
├── helpers/
│   └── test-helpers.ts      # Utility functions for tests
├── auth.test.ts             # Authentication tests
├── categories.test.ts       # Category API tests
├── transactions.test.ts     # Transaction API tests
└── health.test.ts           # Health check tests
```

## Test Helpers

The `test-helpers.ts` file provides utility functions for creating test data:

- `createTestUser()` - Creates a test user with authentication token
- `createTestCategory()` - Creates a test category
- `createTestTransaction()` - Creates a test transaction

## Writing Tests

### Example Test

```typescript
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../index';
import { createTestUser } from './helpers/test-helpers';

describe('My Feature', () => {
  it('should do something', async () => {
    const testUser = await createTestUser();
    
    const response = await request(app)
      .get('/api/some-endpoint')
      .set('Authorization', `Bearer ${testUser.token}`);
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
```

## Test Database

Tests use the same database configuration but with automatic cleanup:
- Database is cleaned before each test
- Each test should create its own test data
- No data persists between tests

## Coverage

Coverage reports are generated in the `coverage/` directory when running `npm run test:coverage`.

Coverage includes:
- Statement coverage
- Branch coverage
- Function coverage
- Line coverage

## Best Practices

1. **Isolated Tests**: Each test should be independent and not rely on other tests
2. **Clean Setup**: Use `beforeEach` to set up test data
3. **Descriptive Names**: Use clear, descriptive test names
4. **Assertions**: Test both success and error cases
5. **Mock External Services**: Mock external API calls or services when needed

## Test Categories

### Unit Tests
Test individual functions and services in isolation.

### Integration Tests
Test API endpoints with the full request/response cycle using Supertest.

### Example Integration Test

```typescript
describe('POST /api/transactions', () => {
  it('should create a transaction', async () => {
    const testUser = await createTestUser();
    
    const response = await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${testUser.token}`)
      .send({
        amount: 100.0,
        description: 'Test',
        type: 'EXPENSE',
      });
    
    expect(response.status).toBe(201);
    expect(response.body.data.transaction.amount).toBe(100.0);
  });
});
```

## Continuous Integration

Tests should be run in CI/CD pipelines:

```yaml
# Example GitHub Actions
- name: Run tests
  run: npm test

- name: Generate coverage
  run: npm run test:coverage
```

## Debugging Tests

1. Use `console.log` or debugger statements
2. Run specific test files: `npm test auth.test.ts`
3. Use `--reporter=verbose` for more output
4. Use `test:ui` for visual test runner







