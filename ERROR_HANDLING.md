# Error Handling Guide

This project implements a comprehensive error handling system with custom error classes, structured logging, and consistent error responses.

## Features

- ✅ Custom error classes (AppError, ValidationError, NotFoundError, etc.)
- ✅ Structured error responses
- ✅ Error logging with context
- ✅ Async error wrapper for route handlers
- ✅ 404 handler for undefined routes
- ✅ Development vs Production error responses

## Error Response Format

All error responses follow this structure:

```json
{
  "success": false,
  "error": {
    "message": "Error message",
    "code": "ERROR_CODE",
    "statusCode": 400,
    "details": {
      "field": ["Error detail"]
    },
    "stack": "Stack trace (development only)"
  }
}
```

## Available Error Classes

### AppError (Base Class)
Base class for all custom errors.

```typescript
throw new AppError('Something went wrong', 500);
```

### ValidationError
For input validation failures (400).

```typescript
throw new ValidationError('Invalid input', {
  email: ['Email is required'],
  age: ['Age must be a number']
});
```

### NotFoundError
For resource not found (404).

```typescript
throw new NotFoundError('User');
// Returns: "User not found"
```

### UnauthorizedError
For authentication failures (401).

```typescript
throw new UnauthorizedError('Invalid credentials');
```

### ForbiddenError
For authorization failures (403).

```typescript
throw new ForbiddenError('You do not have permission');
```

## Usage in Route Handlers

### Using asyncHandler Wrapper

Wrap async route handlers with `asyncHandler` to automatically catch and forward errors:

```typescript
import { asyncHandler } from '../middleware/errorHandler.middleware';
import { NotFoundError } from '../utils/errors';

router.get('/users/:id', asyncHandler(async (req, res) => {
  const user = await findUser(req.params.id);
  if (!user) {
    throw new NotFoundError('User');
  }
  res.json({ success: true, data: user });
}));
```

### Example Routes

The project includes example routes demonstrating error handling:

- `GET /api/example/test-success` - Successful response
- `GET /api/example/test-not-found/:id` - NotFoundError (use id=404)
- `POST /api/example/test-validation` - ValidationError
- `GET /api/example/test-error` - Generic error (500)

## Logging

All errors are automatically logged with context:

- **Operational errors** (AppError): Logged as warnings with request context
- **Programming errors** (unexpected): Logged as errors with full request details

Log format:
```
[TIMESTAMP] [LEVEL] Message | Error: Name - Message | Code: CODE | Status: STATUS | Metadata: {...}
```

## Best Practices

1. **Always use asyncHandler** for async route handlers
2. **Throw appropriate error types** instead of generic errors
3. **Provide detailed validation errors** with field-specific messages
4. **Don't expose internal details** in production error messages
5. **Log errors with context** (already handled automatically)

## Testing Error Handling

You can test the error handling by calling the example routes:

```bash
# Test 404
curl http://localhost:3000/api/example/test-not-found/404

# Test validation error
curl -X POST http://localhost:3000/api/example/test-validation \
  -H "Content-Type: application/json" \
  -d '{"email": "invalid"}'

# Test generic error
curl http://localhost:3000/api/example/test-error

# Test undefined route (404)
curl http://localhost:3000/api/nonexistent
```









