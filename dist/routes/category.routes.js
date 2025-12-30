"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRouter = void 0;
const express_1 = require("express");
const category_controller_1 = require("../controllers/category.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const schemas_1 = require("../utils/validation/schemas");
exports.categoryRouter = (0, express_1.Router)();
// All category routes require authentication
exports.categoryRouter.use(auth_middleware_1.authenticate);
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
exports.categoryRouter.get('/', category_controller_1.categoryController.getAll);
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
exports.categoryRouter.get('/:id', (0, validate_middleware_1.validate)({ params: schemas_1.idParamSchema }), category_controller_1.categoryController.getById);
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
exports.categoryRouter.post('/', (0, validate_middleware_1.validate)({ body: schemas_1.createCategorySchema }), category_controller_1.categoryController.create);
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
exports.categoryRouter.put('/:id', (0, validate_middleware_1.validate)({ params: schemas_1.idParamSchema, body: schemas_1.updateCategorySchema }), category_controller_1.categoryController.update);
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
exports.categoryRouter.delete('/:id', (0, validate_middleware_1.validate)({ params: schemas_1.idParamSchema }), category_controller_1.categoryController.delete);
//# sourceMappingURL=category.routes.js.map