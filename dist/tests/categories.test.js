"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("../index"));
const test_helpers_1 = require("./helpers/test-helpers");
(0, vitest_1.describe)('Categories', () => {
    (0, vitest_1.describe)('GET /api/categories', () => {
        (0, vitest_1.it)('should return all categories for authenticated user', async () => {
            const testUser = await (0, test_helpers_1.createTestUser)();
            // Create some categories
            await (0, supertest_1.default)(index_1.default)
                .post('/api/categories')
                .set('Authorization', `Bearer ${testUser.token}`)
                .send({ name: 'Food', color: '#3B82F6' });
            const response = await (0, supertest_1.default)(index_1.default)
                .get('/api/categories')
                .set('Authorization', `Bearer ${testUser.token}`);
            (0, vitest_1.expect)(response.status).toBe(200);
            (0, vitest_1.expect)(response.body.success).toBe(true);
            (0, vitest_1.expect)(Array.isArray(response.body.data.categories)).toBe(true);
            (0, vitest_1.expect)(response.body.data.categories.length).toBeGreaterThan(0);
        });
        (0, vitest_1.it)('should return 401 without authentication', async () => {
            const response = await (0, supertest_1.default)(index_1.default).get('/api/categories');
            (0, vitest_1.expect)(response.status).toBe(401);
        });
    });
    (0, vitest_1.describe)('POST /api/categories', () => {
        (0, vitest_1.it)('should create a new category', async () => {
            const testUser = await (0, test_helpers_1.createTestUser)();
            const response = await (0, supertest_1.default)(index_1.default)
                .post('/api/categories')
                .set('Authorization', `Bearer ${testUser.token}`)
                .send({
                name: 'Transportation',
                color: '#10B981',
                icon: 'car',
            });
            (0, vitest_1.expect)(response.status).toBe(201);
            (0, vitest_1.expect)(response.body.success).toBe(true);
            (0, vitest_1.expect)(response.body.data.category.name).toBe('Transportation');
            (0, vitest_1.expect)(response.body.data.category.color).toBe('#10B981');
        });
        (0, vitest_1.it)('should return 400 if name is missing', async () => {
            const testUser = await (0, test_helpers_1.createTestUser)();
            const response = await (0, supertest_1.default)(index_1.default)
                .post('/api/categories')
                .set('Authorization', `Bearer ${testUser.token}`)
                .send({ color: '#3B82F6' });
            (0, vitest_1.expect)(response.status).toBe(400);
            (0, vitest_1.expect)(response.body.success).toBe(false);
        });
        (0, vitest_1.it)('should return 400 if duplicate category name', async () => {
            const testUser = await (0, test_helpers_1.createTestUser)();
            // Create first category
            await (0, supertest_1.default)(index_1.default)
                .post('/api/categories')
                .set('Authorization', `Bearer ${testUser.token}`)
                .send({ name: 'Food' });
            // Try to create duplicate
            const response = await (0, supertest_1.default)(index_1.default)
                .post('/api/categories')
                .set('Authorization', `Bearer ${testUser.token}`)
                .send({ name: 'Food' });
            (0, vitest_1.expect)(response.status).toBe(400);
            (0, vitest_1.expect)(response.body.success).toBe(false);
            (0, vitest_1.expect)(response.body.error.code).toBe('VALIDATION_ERROR');
        });
    });
    (0, vitest_1.describe)('GET /api/categories/:id', () => {
        (0, vitest_1.it)('should return category by ID', async () => {
            const testUser = await (0, test_helpers_1.createTestUser)();
            const createResponse = await (0, supertest_1.default)(index_1.default)
                .post('/api/categories')
                .set('Authorization', `Bearer ${testUser.token}`)
                .send({ name: 'Test Category' });
            const categoryId = createResponse.body.data.category.id;
            const response = await (0, supertest_1.default)(index_1.default)
                .get(`/api/categories/${categoryId}`)
                .set('Authorization', `Bearer ${testUser.token}`);
            (0, vitest_1.expect)(response.status).toBe(200);
            (0, vitest_1.expect)(response.body.success).toBe(true);
            (0, vitest_1.expect)(response.body.data.category.id).toBe(categoryId);
        });
        (0, vitest_1.it)('should return 404 for non-existent category', async () => {
            const testUser = await (0, test_helpers_1.createTestUser)();
            const response = await (0, supertest_1.default)(index_1.default)
                .get('/api/categories/00000000-0000-0000-0000-000000000000')
                .set('Authorization', `Bearer ${testUser.token}`);
            (0, vitest_1.expect)(response.status).toBe(404);
            (0, vitest_1.expect)(response.body.success).toBe(false);
        });
    });
    (0, vitest_1.describe)('PUT /api/categories/:id', () => {
        (0, vitest_1.it)('should update category', async () => {
            const testUser = await (0, test_helpers_1.createTestUser)();
            const createResponse = await (0, supertest_1.default)(index_1.default)
                .post('/api/categories')
                .set('Authorization', `Bearer ${testUser.token}`)
                .send({ name: 'Old Name' });
            const categoryId = createResponse.body.data.category.id;
            const response = await (0, supertest_1.default)(index_1.default)
                .put(`/api/categories/${categoryId}`)
                .set('Authorization', `Bearer ${testUser.token}`)
                .send({ name: 'New Name' });
            (0, vitest_1.expect)(response.status).toBe(200);
            (0, vitest_1.expect)(response.body.success).toBe(true);
            (0, vitest_1.expect)(response.body.data.category.name).toBe('New Name');
        });
    });
    (0, vitest_1.describe)('DELETE /api/categories/:id', () => {
        (0, vitest_1.it)('should delete category', async () => {
            const testUser = await (0, test_helpers_1.createTestUser)();
            const createResponse = await (0, supertest_1.default)(index_1.default)
                .post('/api/categories')
                .set('Authorization', `Bearer ${testUser.token}`)
                .send({ name: 'To Delete' });
            const categoryId = createResponse.body.data.category.id;
            const response = await (0, supertest_1.default)(index_1.default)
                .delete(`/api/categories/${categoryId}`)
                .set('Authorization', `Bearer ${testUser.token}`);
            (0, vitest_1.expect)(response.status).toBe(200);
            (0, vitest_1.expect)(response.body.success).toBe(true);
        });
    });
});
//# sourceMappingURL=categories.test.js.map