# Authentication & Authorization Guide

This project implements JWT-based authentication with password hashing using bcrypt.

## Features

- ✅ User registration with email and password
- ✅ User login with JWT token generation
- ✅ Password hashing with bcrypt
- ✅ JWT token-based authentication
- ✅ Protected routes middleware
- ✅ Get current user endpoint

## Setup

### Environment Variables

Add to your `.env` file:

```env
JWT_SECRET=your-very-secret-key-change-in-production-min-32-characters
JWT_EXPIRES_IN=7d
```

**Important:** Use a strong, random secret key in production. You can generate one using:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## API Endpoints

### Public Routes

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123",
  "name": "John Doe"  // optional
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "token": "jwt-token-here"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "token": "jwt-token-here"
  }
}
```

### Protected Routes

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

## Password Requirements

Passwords must meet the following criteria:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

## Using Authentication in Routes

### Protecting Routes

Use the `authenticate` middleware to protect routes:

```typescript
import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { asyncHandler } from '../middleware/errorHandler.middleware';

const router = Router();

// Protected route
router.get('/protected', authenticate, asyncHandler(async (req, res) => {
  // req.user is available here
  const userId = req.user!.userId;
  const email = req.user!.email;
  
  res.json({
    success: true,
    data: { userId, email },
  });
}));
```

### Optional Authentication

Use `optionalAuth` if authentication is optional but useful when present:

```typescript
router.get('/public-or-private', optionalAuth, asyncHandler(async (req, res) => {
  if (req.user) {
    // User is authenticated, show personalized content
  } else {
    // Show public content
  }
}));
```

## Accessing User in Controllers

After using the `authenticate` middleware, user information is available on `req.user`:

```typescript
// In your controller
export const myController = {
  getUserData: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId; // TypeScript knows user exists after authenticate
    const email = req.user!.email;
    
    // Use userId to fetch user-specific data
    const data = await getUserData(userId);
    
    res.json({ success: true, data });
  }),
};
```

## Token Usage

### Frontend Integration

Store the token after login/register:

```typescript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
});

const { data } = await response.json();
localStorage.setItem('token', data.token);
```

Include token in subsequent requests:

```typescript
const token = localStorage.getItem('token');
const response = await fetch('/api/auth/me', {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});
```

## Security Best Practices

1. **Never expose passwords** - Passwords are hashed and never returned in API responses
2. **Use HTTPS in production** - JWT tokens should be transmitted over secure connections
3. **Store tokens securely** - Use httpOnly cookies or secure storage on the frontend
4. **Implement token refresh** - Consider adding refresh tokens for better security
5. **Rate limiting** - Add rate limiting to login/register endpoints to prevent brute force
6. **Strong JWT secret** - Use a long, random secret key in production

## Error Responses

### Unauthorized (401)
```json
{
  "success": false,
  "error": {
    "message": "Authentication token required",
    "code": "UNAUTHORIZED",
    "statusCode": 401
  }
}
```

### Validation Errors (400)
```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "statusCode": 400,
    "details": {
      "email": ["Email is already in use"],
      "password": ["Password must be at least 8 characters"]
    }
  }
}
```

## Testing Authentication

### Using cURL

1. Register a user:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234","name":"Test User"}'
```

2. Login:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234"}'
```

3. Get current user (replace TOKEN with token from login):
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```








