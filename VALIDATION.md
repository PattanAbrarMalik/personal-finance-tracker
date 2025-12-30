# Request Validation Guide

This project uses [Zod](https://zod.dev) for type-safe schema validation. All request validation is handled through middleware that integrates with our error handling system.

## Features

- ✅ Type-safe validation with Zod schemas
- ✅ Automatic validation error handling
- ✅ Validates body, query, and params
- ✅ Integration with custom error classes
- ✅ Detailed validation error messages

## Basic Usage

### Using the validate middleware

```typescript
import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.middleware';
import { asyncHandler } from '../middleware/errorHandler.middleware';

const router = Router();

router.post(
  '/users',
  validate({
    body: z.object({
      name: z.string().min(1, 'Name is required'),
      email: z.string().email('Invalid email'),
      age: z.number().int().positive('Age must be positive'),
    }),
  }),
  asyncHandler(async (req, res) => {
    // req.body is now typed and validated
    const { name, email, age } = req.body;
    // ... your logic
  })
);
```

### Validating Query Parameters

```typescript
router.get(
  '/users',
  validate({
    query: z.object({
      page: z.string().regex(/^\d+$/).optional(),
      limit: z.string().regex(/^\d+$/).optional(),
      search: z.string().optional(),
    }),
  }),
  asyncHandler(async (req, res) => {
    // req.query is validated and typed
    const { page, limit, search } = req.query;
  })
);
```

### Validating Route Parameters

```typescript
router.get(
  '/users/:id',
  validate({
    params: z.object({
      id: z.string().uuid('Invalid ID format'),
    }),
  }),
  asyncHandler(async (req, res) => {
    // req.params.id is validated
    const { id } = req.params;
  })
);
```

### Combining Multiple Validations

```typescript
router.put(
  '/users/:id',
  validate({
    params: z.object({
      id: z.string().uuid(),
    }),
    body: z.object({
      name: z.string().min(1).optional(),
      email: z.string().email().optional(),
    }),
    query: z.object({
      notify: z.enum(['true', 'false']).optional(),
    }),
  }),
  asyncHandler(async (req, res) => {
    // All are validated
    const { id } = req.params;
    const { name, email } = req.body;
    const { notify } = req.query;
  })
);
```

## Predefined Schemas

Common validation schemas are available in `src/utils/validation/schemas.ts`:

```typescript
import { idParamSchema, paginationQuerySchema, emailSchema, passwordSchema } from '../utils/validation/schemas';

// Use predefined schemas
router.get('/users/:id', validate({ params: idParamSchema }), handler);
router.get('/users', validate({ query: paginationQuerySchema }), handler);
```

## Error Response Format

Validation errors return a structured error response:

```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "statusCode": 400,
    "details": {
      "email": ["Invalid email format"],
      "age": ["Age must be a positive integer"]
    }
  }
}
```

## Zod Schema Examples

### Common Patterns

```typescript
// Required string
z.string().min(1, 'Required')

// Optional field
z.string().optional()

// Email validation
z.string().email('Invalid email')

// Number with constraints
z.number().int().positive('Must be positive')

// Enum
z.enum(['option1', 'option2', 'option3'])

// Date
z.string().datetime() // ISO 8601
z.coerce.date() // Coerce string to Date

// Array
z.array(z.string())

// Object with nested validation
z.object({
  user: z.object({
    name: z.string(),
    email: z.string().email(),
  }),
})

// Transformations
z.string().transform((val) => val.toUpperCase())
z.string().regex(/^\d+$/).transform((val) => parseInt(val, 10))

// Custom validation
z.string().refine((val) => val.length >= 8, {
  message: 'Must be at least 8 characters',
})
```

## Best Practices

1. **Always validate user input** - Never trust client data
2. **Use descriptive error messages** - Help users understand what went wrong
3. **Reuse common schemas** - Keep schemas in `schemas.ts` for consistency
4. **Validate early** - Validate before business logic
5. **Type inference** - Zod provides TypeScript types automatically

## Testing Validation

Test validation endpoints with invalid data:

```bash
# Test validation error
curl -X POST http://localhost:3000/api/example/test-validation \
  -H "Content-Type: application/json" \
  -d '{"email": "invalid", "age": -5}'

# Expected: 400 with validation error details
```

