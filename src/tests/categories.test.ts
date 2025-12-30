import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../index';
import { createTestUser } from './helpers/test-helpers';

describe('Categories', () => {
  describe('GET /api/categories', () => {
    it('should return all categories for authenticated user', async () => {
      const testUser = await createTestUser();
      
      // Create some categories
      await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${testUser.token}`)
        .send({ name: 'Food', color: '#3B82F6' });

      const response = await request(app)
        .get('/api/categories')
        .set('Authorization', `Bearer ${testUser.token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.categories)).toBe(true);
      expect(response.body.data.categories.length).toBeGreaterThan(0);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app).get('/api/categories');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/categories', () => {
    it('should create a new category', async () => {
      const testUser = await createTestUser();

      const response = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${testUser.token}`)
        .send({
          name: 'Transportation',
          color: '#10B981',
          icon: 'car',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.category.name).toBe('Transportation');
      expect(response.body.data.category.color).toBe('#10B981');
    });

    it('should return 400 if name is missing', async () => {
      const testUser = await createTestUser();

      const response = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${testUser.token}`)
        .send({ color: '#3B82F6' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should return 400 if duplicate category name', async () => {
      const testUser = await createTestUser();

      // Create first category
      await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${testUser.token}`)
        .send({ name: 'Food' });

      // Try to create duplicate
      const response = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${testUser.token}`)
        .send({ name: 'Food' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('GET /api/categories/:id', () => {
    it('should return category by ID', async () => {
      const testUser = await createTestUser();

      const createResponse = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${testUser.token}`)
        .send({ name: 'Test Category' });

      const categoryId = createResponse.body.data.category.id;

      const response = await request(app)
        .get(`/api/categories/${categoryId}`)
        .set('Authorization', `Bearer ${testUser.token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.category.id).toBe(categoryId);
    });

    it('should return 404 for non-existent category', async () => {
      const testUser = await createTestUser();

      const response = await request(app)
        .get('/api/categories/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${testUser.token}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/categories/:id', () => {
    it('should update category', async () => {
      const testUser = await createTestUser();

      const createResponse = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${testUser.token}`)
        .send({ name: 'Old Name' });

      const categoryId = createResponse.body.data.category.id;

      const response = await request(app)
        .put(`/api/categories/${categoryId}`)
        .set('Authorization', `Bearer ${testUser.token}`)
        .send({ name: 'New Name' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.category.name).toBe('New Name');
    });
  });

  describe('DELETE /api/categories/:id', () => {
    it('should delete category', async () => {
      const testUser = await createTestUser();

      const createResponse = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${testUser.token}`)
        .send({ name: 'To Delete' });

      const categoryId = createResponse.body.data.category.id;

      const response = await request(app)
        .delete(`/api/categories/${categoryId}`)
        .set('Authorization', `Bearer ${testUser.token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});








