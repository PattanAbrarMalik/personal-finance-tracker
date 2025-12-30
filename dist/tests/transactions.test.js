"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("../index"));
const test_helpers_1 = require("./helpers/test-helpers");
(0, vitest_1.describe)('Transactions', () => {
    (0, vitest_1.describe)('POST /api/transactions', () => {
        (0, vitest_1.it)('should create a new expense transaction', async () => {
            const testUser = await (0, test_helpers_1.createTestUser)();
            const category = await (0, test_helpers_1.createTestCategory)(testUser.id);
            const response = await (0, supertest_1.default)(index_1.default)
                .post('/api/transactions')
                .set('Authorization', `Bearer ${testUser.token}`)
                .send({
                amount: 50.0,
                description: 'Lunch',
                type: 'EXPENSE',
                categoryId: category.id,
            });
            (0, vitest_1.expect)(response.status).toBe(201);
            (0, vitest_1.expect)(response.body.success).toBe(true);
            (0, vitest_1.expect)(response.body.data.transaction.amount).toBe(50.0);
            (0, vitest_1.expect)(response.body.data.transaction.type).toBe('EXPENSE');
        });
        (0, vitest_1.it)('should create a new income transaction', async () => {
            const testUser = await (0, test_helpers_1.createTestUser)();
            const response = await (0, supertest_1.default)(index_1.default)
                .post('/api/transactions')
                .set('Authorization', `Bearer ${testUser.token}`)
                .send({
                amount: 1000.0,
                description: 'Salary',
                type: 'INCOME',
            });
            (0, vitest_1.expect)(response.status).toBe(201);
            (0, vitest_1.expect)(response.body.success).toBe(true);
            (0, vitest_1.expect)(response.body.data.transaction.type).toBe('INCOME');
        });
        (0, vitest_1.it)('should return 400 if amount is invalid', async () => {
            const testUser = await (0, test_helpers_1.createTestUser)();
            const response = await (0, supertest_1.default)(index_1.default)
                .post('/api/transactions')
                .set('Authorization', `Bearer ${testUser.token}`)
                .send({
                amount: -10,
                description: 'Invalid',
                type: 'EXPENSE',
            });
            (0, vitest_1.expect)(response.status).toBe(400);
            (0, vitest_1.expect)(response.body.success).toBe(false);
        });
    });
    (0, vitest_1.describe)('GET /api/transactions', () => {
        (0, vitest_1.it)('should return transactions with pagination', async () => {
            const testUser = await (0, test_helpers_1.createTestUser)();
            // Create some transactions
            await (0, supertest_1.default)(index_1.default)
                .post('/api/transactions')
                .set('Authorization', `Bearer ${testUser.token}`)
                .send({
                amount: 50.0,
                description: 'Transaction 1',
                type: 'EXPENSE',
            });
            const response = await (0, supertest_1.default)(index_1.default)
                .get('/api/transactions?page=1&limit=10')
                .set('Authorization', `Bearer ${testUser.token}`);
            (0, vitest_1.expect)(response.status).toBe(200);
            (0, vitest_1.expect)(response.body.success).toBe(true);
            (0, vitest_1.expect)(response.body.data.pagination).toBeDefined();
            (0, vitest_1.expect)(response.body.data.transactions).toBeDefined();
        });
        (0, vitest_1.it)('should filter transactions by type', async () => {
            const testUser = await (0, test_helpers_1.createTestUser)();
            await (0, supertest_1.default)(index_1.default)
                .post('/api/transactions')
                .set('Authorization', `Bearer ${testUser.token}`)
                .send({
                amount: 100.0,
                description: 'Income',
                type: 'INCOME',
            });
            const response = await (0, supertest_1.default)(index_1.default)
                .get('/api/transactions?type=INCOME')
                .set('Authorization', `Bearer ${testUser.token}`);
            (0, vitest_1.expect)(response.status).toBe(200);
            (0, vitest_1.expect)(response.body.data.transactions.every((t) => t.type === 'INCOME')).toBe(true);
        });
    });
    (0, vitest_1.describe)('GET /api/transactions/stats', () => {
        (0, vitest_1.it)('should return transaction statistics', async () => {
            const testUser = await (0, test_helpers_1.createTestUser)();
            // Create income
            await (0, supertest_1.default)(index_1.default)
                .post('/api/transactions')
                .set('Authorization', `Bearer ${testUser.token}`)
                .send({
                amount: 1000.0,
                description: 'Income',
                type: 'INCOME',
            });
            // Create expense
            await (0, supertest_1.default)(index_1.default)
                .post('/api/transactions')
                .set('Authorization', `Bearer ${testUser.token}`)
                .send({
                amount: 200.0,
                description: 'Expense',
                type: 'EXPENSE',
            });
            const response = await (0, supertest_1.default)(index_1.default)
                .get('/api/transactions/stats')
                .set('Authorization', `Bearer ${testUser.token}`);
            (0, vitest_1.expect)(response.status).toBe(200);
            (0, vitest_1.expect)(response.body.success).toBe(true);
            (0, vitest_1.expect)(response.body.data.stats.totalIncome).toBe(1000.0);
            (0, vitest_1.expect)(response.body.data.stats.totalExpenses).toBe(200.0);
            (0, vitest_1.expect)(response.body.data.stats.balance).toBe(800.0);
        });
    });
});
//# sourceMappingURL=transactions.test.js.map