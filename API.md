# API Documentation

Complete API documentation for the Personal Finance Tracker backend.

## Base URL

```
http://localhost:3000/api
```

## Authentication

Most endpoints require authentication via JWT token. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123",
  "name": "John Doe"  // optional
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

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

---

### Categories

All category endpoints require authentication.

#### Get All Categories
```http
GET /api/categories
Authorization: Bearer <token>
```

#### Get Category by ID
```http
GET /api/categories/:id
Authorization: Bearer <token>
```

#### Create Category
```http
POST /api/categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Food",
  "color": "#3B82F6",  // optional, hex color
  "icon": "food-icon"  // optional
}
```

#### Update Category
```http
PUT /api/categories/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Groceries",  // optional
  "color": "#10B981",   // optional
  "icon": "grocery-icon" // optional
}
```

#### Delete Category
```http
DELETE /api/categories/:id
Authorization: Bearer <token>
```

**Note:** Cannot delete categories that are used in transactions.

---

### Transactions

All transaction endpoints require authentication.

#### Get All Transactions
```http
GET /api/transactions?type=EXPENSE&categoryId=uuid&startDate=2024-01-01&endDate=2024-12-31&page=1&limit=50
Authorization: Bearer <token>
```

**Query Parameters:**
- `type` (optional): `INCOME` or `EXPENSE`
- `categoryId` (optional): UUID of category
- `startDate` (optional): Start date (ISO string)
- `endDate` (optional): End date (ISO string)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 50)

#### Get Transaction by ID
```http
GET /api/transactions/:id
Authorization: Bearer <token>
```

#### Get Transaction Statistics
```http
GET /api/transactions/stats?startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer <token>
```

**Query Parameters:**
- `startDate` (optional): Start date (ISO string)
- `endDate` (optional): End date (ISO string)

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalIncome": 5000.00,
      "totalExpenses": 3000.00,
      "balance": 2000.00,
      "transactionCount": 45
    }
  }
}
```

#### Create Transaction
```http
POST /api/transactions
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 100.50,
  "description": "Grocery shopping",
  "type": "EXPENSE",  // or "INCOME"
  "date": "2024-01-15T10:00:00Z",  // optional, defaults to now
  "categoryId": "uuid"  // optional
}
```

#### Update Transaction
```http
PUT /api/transactions/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 150.00,  // optional
  "description": "Updated description",  // optional
  "type": "INCOME",  // optional
  "date": "2024-01-16T10:00:00Z",  // optional
  "categoryId": "uuid"  // optional, use null to remove category
}
```

#### Delete Transaction
```http
DELETE /api/transactions/:id
Authorization: Bearer <token>
```

---

### Budgets

All budget endpoints require authentication.

#### Get All Budgets
```http
GET /api/budgets
Authorization: Bearer <token>
```

#### Get Budget by ID
```http
GET /api/budgets/:id
Authorization: Bearer <token>
```

#### Get Budget Progress
```http
GET /api/budgets/:id/progress
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "progress": {
      "budget": { /* budget object */ },
      "spent": 750.00,
      "remaining": 250.00,
      "percentage": 75.0,
      "isExceeded": false
    }
  }
}
```

#### Create Budget
```http
POST /api/budgets
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Monthly Food Budget",
  "amount": 1000.00,
  "period": "MONTHLY",  // "WEEKLY", "MONTHLY", or "YEARLY"
  "categoryId": "uuid",  // optional
  "startDate": "2024-01-01T00:00:00Z",
  "endDate": "2024-01-31T23:59:59Z"  // optional
}
```

#### Update Budget
```http
PUT /api/budgets/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Budget Name",  // optional
  "amount": 1200.00,  // optional
  "period": "YEARLY",  // optional
  "categoryId": "uuid",  // optional, use null to remove category
  "startDate": "2024-02-01T00:00:00Z",  // optional
  "endDate": "2024-02-29T23:59:59Z"  // optional, use null to remove end date
}
```

#### Delete Budget
```http
DELETE /api/budgets/:id
Authorization: Bearer <token>
```

---

## Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Error message",
    "code": "ERROR_CODE",
    "statusCode": 400,
    "details": {
      "field": ["Error detail"]
    }
  }
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (authorization failed)
- `404` - Not Found
- `500` - Internal Server Error

## Error Codes

- `VALIDATION_ERROR` - Input validation failed
- `UNAUTHORIZED` - Authentication failed
- `FORBIDDEN` - Authorization failed
- `NOT_FOUND` - Resource not found

## Example Usage

### Complete Flow

1. **Register/Login:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234","name":"Test User"}'
```

2. **Create Category:**
```bash
curl -X POST http://localhost:3000/api/categories \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Food","color":"#3B82F6"}'
```

3. **Create Transaction:**
```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"amount":50.00,"description":"Lunch","type":"EXPENSE","categoryId":"<category-id>"}'
```

4. **Get Statistics:**
```bash
curl -X GET http://localhost:3000/api/transactions/stats \
  -H "Authorization: Bearer <token>"
```








