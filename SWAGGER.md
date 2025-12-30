# API Documentation with Swagger

This project includes interactive API documentation using Swagger (OpenAPI 3.0).

## Accessing the Documentation

Once the server is running, visit:

```
http://localhost:3000/api-docs
```

This will display an interactive Swagger UI where you can:
- Browse all available endpoints
- See request/response schemas
- Test API endpoints directly
- View authentication requirements

## Features

- **Interactive Testing**: Test endpoints directly from the browser
- **Authentication Support**: Use the "Authorize" button to add JWT tokens
- **Schema Documentation**: Complete request/response schemas
- **Error Responses**: Documented error responses with examples

## Using the Documentation

### 1. Authentication

1. First, register or login to get a JWT token:
   - Go to `/auth/register` or `/auth/login`
   - Copy the `token` from the response

2. Authorize in Swagger UI:
   - Click the "Authorize" button (lock icon) at the top
   - Enter: `Bearer <your-token>` (or just the token)
   - Click "Authorize"
   - Now you can test protected endpoints

### 2. Testing Endpoints

1. Click on any endpoint to expand it
2. Click "Try it out"
3. Fill in the required parameters/body
4. Click "Execute"
5. View the response below

### 3. Response Codes

All endpoints document possible response codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

## Schema Definitions

The documentation includes schemas for:
- **User** - User information
- **Category** - Transaction categories
- **Transaction** - Income/expense transactions
- **Budget** - Budget definitions
- **Error** - Error response format

## Adding Documentation to New Endpoints

To add Swagger documentation to a new endpoint, add JSDoc comments above the route:

```typescript
/**
 * @swagger
 * /api/example:
 *   get:
 *     summary: Example endpoint
 *     tags: [Example]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 */
router.get('/example', controller.example);
```

## Documentation Structure

- All endpoints are organized by tags (Authentication, Categories, Transactions, etc.)
- Protected endpoints include `security: - bearerAuth: []`
- Public endpoints include `security: []`
- Request bodies and responses are fully documented

## OpenAPI Specification

The full OpenAPI 3.0 specification is generated from:
- Route definitions in `src/routes/*.ts`
- Schema definitions in `src/config/swagger.ts`

You can export the specification JSON by accessing:
```
http://localhost:3000/api-docs/swagger.json
```

This can be used with other OpenAPI tools or imported into Postman.







