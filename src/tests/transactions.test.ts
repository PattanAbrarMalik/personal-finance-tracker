import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../index';
import { createTestUser, createTestCategory } from './helpers/test-helpers';

describe('Transactions', () => {
  describe('POST /api/transactions', () => {
    it('should create a new expense transaction', async () => {
      const testUser = await createTestUser();
      const category = await createTestCategory(testUser.id);

      const response = await request(app)
        .post('/api/transactions')
        .set('Authorization', `Bearer ${testUser.token}`)
        .send({
          amount: 50.0,
          description: 'Lunch',
          type: 'EXPENSE',
          categoryId: category.id,
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.transaction.amount).toBe(50.0);
      expect(response.body.data.transaction.type).toBe('EXPENSE');
    });

    it('should create a new income transaction', async () => {
      const testUser = await createTestUser();

      const response = await request(app)
        .post('/api/transactions')
        .set('Authorization', `Bearer ${testUser.token}`)
        .send({
          amount: 1000.0,
          description: 'Salary',
          type: 'INCOME',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.transaction.type).toBe('INCOME');
    });

    it('should return 400 if amount is invalid', async () => {
      const testUser = await createTestUser();

      const response = await request(app)
        .post('/api/transactions')
        .set('Authorization', `Bearer ${testUser.token}`)
        .send({
          amount: -10,
          description: 'Invalid',
          type: 'EXPENSE',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/transactions', () => {
    it('should return transactions with pagination', async () => {
      const testUser = await createTestUser();

      // Create some transactions
      await request(app)
        .post('/api/transactions')
        .set('Authorization', `Bearer ${testUser.token}`)
        .send({
          amount: 50.0,
          description: 'Transaction 1',
          type: 'EXPENSE',
        });

      const response = await request(app)
        .get('/api/transactions?page=1&limit=10')
        .set('Authorization', `Bearer ${testUser.token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.pagination).toBeDefined();
      expect(response.body.data.transactions).toBeDefined();
    });

    it('should filter transactions by type', async () => {
      const testUser = await createTestUser();

      await request(app)
        .post('/api/transactions')
        .set('Authorization', `Bearer ${testUser.token}`)
        .send({
          amount: 100.0,
          description: 'Income',
          type: 'INCOME',
        });

      const response = await request(app)
        .get('/api/transactions?type=INCOME')
        .set('Authorization', `Bearer ${testUser.token}`);

      expect(response.status).toBe(200);
      expect(response.body.data.transactions.every((t: any) => t.type === 'INCOME')).toBe(true);
    });
  });

  describe('GET /api/transactions/stats', () => {
    it('should return transaction statistics', async () => {
      const testUser = await createTestUser();

      // Create income
      await request(app)
        .post('/api/transactions')
        .set('Authorization', `Bearer ${testUser.token}`)
        .send({
          amount: 1000.0,
          description: 'Income',
          type: 'INCOME',
        });

      // Create expense
      await request(app)
        .post('/api/transactions')
        .set('Authorization', `Bearer ${testUser.token}`)
        .send({
          amount: 200.0,
          description: 'Expense',
          type: 'EXPENSE',
        });

      const response = await request(app)
        .get('/api/transactions/stats')
        .set('Authorization', `Bearer ${testUser.token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.stats.totalIncome).toBe(1000.0);
      expect(response.body.data.stats.totalExpenses).toBe(200.0);
      expect(response.body.data.stats.balance).toBe(800.0);
    });
  });
});








