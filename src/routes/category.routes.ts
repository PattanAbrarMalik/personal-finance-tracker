import { Router } from 'express';
import { categoryController } from '../controllers/category.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  idParamSchema,
  createCategorySchema,
  updateCategorySchema,
} from '../utils/validation/schemas';

export const categoryRouter = Router();

// All category routes require authentication
categoryRouter.use(authenticate);

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories for the authenticated user
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     categories:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Category'
 */
categoryRouter.get('/', categoryController.getAll);

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Category details
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
categoryRouter.get(
  '/:id',
  validate({ params: idParamSchema }),
  categoryController.getById
);

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Food
 *               color:
 *                 type: string
 *                 example: '#3B82F6'
 *               icon:
 *                 type: string
 *                 example: food-icon
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
categoryRouter.post(
  '/',
  validate({ body: createCategorySchema }),
  categoryController.create
);

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Update a category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               color:
 *                 type: string
 *               icon:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
categoryRouter.put(
  '/:id',
  validate({ params: idParamSchema, body: updateCategorySchema }),
  categoryController.update
);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
categoryRouter.delete(
  '/:id',
  validate({ params: idParamSchema }),
  categoryController.delete
);
