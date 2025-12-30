"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const savingsGoal_controller_1 = require("../controllers/savingsGoal.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
// Validation schemas
const createGoalSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Goal name is required').max(100),
    description: zod_1.z.string().optional(),
    targetAmount: zod_1.z.number().positive('Target amount must be greater than 0'),
    category: zod_1.z.string().optional(),
    icon: zod_1.z.string().optional(),
    color: zod_1.z.string().optional(),
    deadline: zod_1.z.string().datetime().optional().or(zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(),
    priority: zod_1.z.enum(['low', 'medium', 'high']).optional(),
});
const updateGoalSchema = createGoalSchema.partial();
const addAmountSchema = zod_1.z.object({
    amount: zod_1.z.number().positive('Amount must be greater than 0'),
});
// Apply authentication middleware to all routes
router.use(auth_middleware_1.authenticate);
// Get all savings goals
router.get('/', savingsGoal_controller_1.savingsGoalController.getAll);
// Get savings goals statistics
router.get('/stats', savingsGoal_controller_1.savingsGoalController.getStats);
// Get single goal
router.get('/:id', savingsGoal_controller_1.savingsGoalController.getById);
// Create goal
router.post('/', (0, validate_middleware_1.validate)({ body: createGoalSchema }), savingsGoal_controller_1.savingsGoalController.create);
// Update goal
router.put('/:id', (0, validate_middleware_1.validate)({ body: updateGoalSchema }), savingsGoal_controller_1.savingsGoalController.update);
// Delete goal
router.delete('/:id', savingsGoal_controller_1.savingsGoalController.delete);
// Add amount to goal
router.post('/:id/add', (0, validate_middleware_1.validate)({ body: addAmountSchema }), savingsGoal_controller_1.savingsGoalController.addAmount);
exports.default = router;
//# sourceMappingURL=savingsGoal.routes.js.map