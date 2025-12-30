import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../index';

describe('Health Check', () => {
  it('should return health status', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe('ok');
    expect(response.body.data.timestamp).toBeDefined();
    expect(response.body.data.uptime).toBeDefined();
  });
});








