"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.budgetRouter = void 0;
const express_1 = require("express");
const budget_controller_1 = require("../controllers/budget.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const schemas_1 = require("../utils/validation/schemas");
exports.budgetRouter = (0, express_1.Router)();
// All budget routes require authentication
exports.budgetRouter.use(auth_middleware_1.authenticate);
exports.budgetRouter.get('/', budget_controller_1.budgetController.getAll);
exports.budgetRouter.get('/:id', (0, validate_middleware_1.validate)({ params: schemas_1.idParamSchema }), budget_controller_1.budgetController.getById);
exports.budgetRouter.get('/:id/progress', (0, validate_middleware_1.validate)({ params: schemas_1.idParamSchema }), budget_controller_1.budgetController.getProgress);
exports.budgetRouter.post('/', (0, validate_middleware_1.validate)({ body: schemas_1.createBudgetSchema }), budget_controller_1.budgetController.create);
exports.budgetRouter.put('/:id', (0, validate_middleware_1.validate)({ params: schemas_1.idParamSchema, body: schemas_1.updateBudgetSchema }), budget_controller_1.budgetController.update);
exports.budgetRouter.delete('/:id', (0, validate_middleware_1.validate)({ params: schemas_1.idParamSchema }), budget_controller_1.budgetController.delete);
//# sourceMappingURL=budget.routes.js.map