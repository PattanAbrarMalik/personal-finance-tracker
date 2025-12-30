import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../middleware/errorHandler.middleware';
import { validate } from '../middleware/validate.middleware';
import { NotFoundError } from '../utils/errors';

export const exampleRouter = Router();

// Example route demonstrating error handling
exampleRouter.get(
  '/test-success',
  asyncHandler(async (req, res) => {
    res.status(200).json({
      success: true,
      data: { message: 'This is a successful response' },
    });
  })
);

// Example route demonstrating NotFoundError with validation
exampleRouter.get(
  '/test-not-found/:id',
  validate({
    params: z.object({
      id: z.string().min(1, 'ID is required'),
    }),
  }),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (id === '404') {
      throw new NotFoundError('Resource');
    }
    res.status(200).json({
      success: true,
      data: { id, message: 'Found' },
    });
  })
);

// Example route demonstrating ValidationError with Zod
exampleRouter.post(
  '/test-validation',
  validate({
    body: z.object({
      email: z.string().email('Invalid email format'),
      age: z.number().int().positive('Age must be a positive integer'),
    }),
  }),
  asyncHandler(async (req, res) => {
    const { email, age } = req.body;
    res.status(200).json({
      success: true,
      data: { email, age },
    });
  })
);

// Example route demonstrating generic error (will be caught as 500)
exampleRouter.get(
  '/test-error',
  asyncHandler(async (req, res) => {
    throw new Error('This is an unexpected error');
  })
);
