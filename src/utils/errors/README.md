# Error Handling

This directory contains custom error classes for structured error handling throughout the application.

## Error Classes

### AppError (Base Class)
Base error class that all custom errors extend from.

```typescript
throw new AppError('Something went wrong', 500);
```

### ValidationError
For input validation failures (400).

```typescript
throw new ValidationError('Invalid input', { email: ['Email is required'] });
```

### NotFoundError
For resource not found scenarios (404).

```typescript
throw new NotFoundError('User');
```

### UnauthorizedError
For authentication failures (401).

```typescript
throw new UnauthorizedError('Invalid credentials');
```

### ForbiddenError
For authorization failures (403).

```typescript
throw new ForbiddenError('You do not have permission to access this resource');
```

## Usage in Route Handlers

Use the `asyncHandler` wrapper to automatically catch errors:

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









