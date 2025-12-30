"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("../index"));
const test_helpers_1 = require("./helpers/test-helpers");
(0, vitest_1.describe)('Authentication', () => {
    (0, vitest_1.describe)('POST /api/auth/register', () => {
        (0, vitest_1.it)('should register a new user successfully', async () => {
            const response = await (0, supertest_1.default)(index_1.default)
                .post('/api/auth/register')
                .send({
                email: 'newuser@example.com',
                password: 'Test1234',
                name: 'New User',
            });
            (0, vitest_1.expect)(response.status).toBe(201);
            (0, vitest_1.expect)(response.body.success).toBe(true);
            (0, vitest_1.expect)(response.body.data.user).toHaveProperty('id');
            (0, vitest_1.expect)(response.body.data.user.email).toBe('newuser@example.com');
            (0, vitest_1.expect)(response.body.data.user.name).toBe('New User');
            (0, vitest_1.expect)(response.body.data.token).toBeDefined();
            (0, vitest_1.expect)(response.body.data.user).not.toHaveProperty('password');
        });
        (0, vitest_1.it)('should return 400 if email is invalid', async () => {
            const response = await (0, supertest_1.default)(index_1.default)
                .post('/api/auth/register')
                .send({
                email: 'invalid-email',
                password: 'Test1234',
            });
            (0, vitest_1.expect)(response.status).toBe(400);
            (0, vitest_1.expect)(response.body.success).toBe(false);
            (0, vitest_1.expect)(response.body.error.code).toBe('VALIDATION_ERROR');
        });
        (0, vitest_1.it)('should return 400 if password is too weak', async () => {
            const response = await (0, supertest_1.default)(index_1.default)
                .post('/api/auth/register')
                .send({
                email: 'user@example.com',
                password: 'weak',
            });
            (0, vitest_1.expect)(response.status).toBe(400);
            (0, vitest_1.expect)(response.body.success).toBe(false);
            (0, vitest_1.expect)(response.body.error.code).toBe('VALIDATION_ERROR');
        });
        (0, vitest_1.it)('should return 400 if email already exists', async () => {
            await (0, test_helpers_1.createTestUser)('existing@example.com');
            const response = await (0, supertest_1.default)(index_1.default)
                .post('/api/auth/register')
                .send({
                email: 'existing@example.com',
                password: 'Test1234',
            });
            (0, vitest_1.expect)(response.status).toBe(400);
            (0, vitest_1.expect)(response.body.success).toBe(false);
            (0, vitest_1.expect)(response.body.error.code).toBe('VALIDATION_ERROR');
        });
    });
    (0, vitest_1.describe)('POST /api/auth/login', () => {
        (0, vitest_1.it)('should login with valid credentials', async () => {
            await (0, test_helpers_1.createTestUser)('login@example.com', 'Test1234');
            const response = await (0, supertest_1.default)(index_1.default)
                .post('/api/auth/login')
                .send({
                email: 'login@example.com',
                password: 'Test1234',
            });
            (0, vitest_1.expect)(response.status).toBe(200);
            (0, vitest_1.expect)(response.body.success).toBe(true);
            (0, vitest_1.expect)(response.body.data.user.email).toBe('login@example.com');
            (0, vitest_1.expect)(response.body.data.token).toBeDefined();
        });
        (0, vitest_1.it)('should return 401 with invalid credentials', async () => {
            await (0, test_helpers_1.createTestUser)('user@example.com', 'Test1234');
            const response = await (0, supertest_1.default)(index_1.default)
                .post('/api/auth/login')
                .send({
                email: 'user@example.com',
                password: 'WrongPassword',
            });
            (0, vitest_1.expect)(response.status).toBe(401);
            (0, vitest_1.expect)(response.body.success).toBe(false);
            (0, vitest_1.expect)(response.body.error.code).toBe('UNAUTHORIZED');
        });
        (0, vitest_1.it)('should return 401 with non-existent email', async () => {
            const response = await (0, supertest_1.default)(index_1.default)
                .post('/api/auth/login')
                .send({
                email: 'nonexistent@example.com',
                password: 'Test1234',
            });
            (0, vitest_1.expect)(response.status).toBe(401);
            (0, vitest_1.expect)(response.body.success).toBe(false);
            (0, vitest_1.expect)(response.body.error.code).toBe('UNAUTHORIZED');
        });
    });
    (0, vitest_1.describe)('GET /api/auth/me', () => {
        (0, vitest_1.it)('should return current user with valid token', async () => {
            const testUser = await (0, test_helpers_1.createTestUser)('me@example.com');
            const response = await (0, supertest_1.default)(index_1.default)
                .get('/api/auth/me')
                .set('Authorization', `Bearer ${testUser.token}`);
            (0, vitest_1.expect)(response.status).toBe(200);
            (0, vitest_1.expect)(response.body.success).toBe(true);
            (0, vitest_1.expect)(response.body.data.user.email).toBe('me@example.com');
            (0, vitest_1.expect)(response.body.data.user.id).toBe(testUser.id);
        });
        (0, vitest_1.it)('should return 401 without token', async () => {
            const response = await (0, supertest_1.default)(index_1.default).get('/api/auth/me');
            (0, vitest_1.expect)(response.status).toBe(401);
            (0, vitest_1.expect)(response.body.success).toBe(false);
            (0, vitest_1.expect)(response.body.error.code).toBe('UNAUTHORIZED');
        });
        (0, vitest_1.it)('should return 401 with invalid token', async () => {
            const response = await (0, supertest_1.default)(index_1.default)
                .get('/api/auth/me')
                .set('Authorization', 'Bearer invalid-token');
            (0, vitest_1.expect)(response.status).toBe(401);
            (0, vitest_1.expect)(response.body.success).toBe(false);
            (0, vitest_1.expect)(response.body.error.code).toBe('UNAUTHORIZED');
        });
    });
});
//# sourceMappingURL=auth.test.js.map