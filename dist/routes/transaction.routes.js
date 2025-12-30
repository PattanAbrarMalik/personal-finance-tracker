"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionRouter = void 0;
const express_1 = require("express");
const transaction_controller_1 = require("../controllers/transaction.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const schemas_1 = require("../utils/validation/schemas");
exports.transactionRouter = (0, express_1.Router)();
// All transaction routes require authentication
exports.transactionRouter.use(auth_middleware_1.authenticate);
exports.transactionRouter.get('/', (0, validate_middleware_1.validate)({ query: schemas_1.transactionQuerySchema }), transaction_controller_1.transactionController.getAll);
exports.transactionRouter.get('/stats', transaction_controller_1.transactionController.getStats);
exports.transactionRouter.get('/:id', (0, validate_middleware_1.validate)({ params: schemas_1.idParamSchema }), transaction_controller_1.transactionController.getById);
exports.transactionRouter.post('/', (0, validate_middleware_1.validate)({ body: schemas_1.createTransactionSchema }), transaction_controller_1.transactionController.create);
exports.transactionRouter.put('/:id', (0, validate_middleware_1.validate)({ params: schemas_1.idParamSchema, body: schemas_1.updateTransactionSchema }), transaction_controller_1.transactionController.update);
exports.transactionRouter.delete('/:id', (0, validate_middleware_1.validate)({ params: schemas_1.idParamSchema }), transaction_controller_1.transactionController.delete);
//# sourceMappingURL=transaction.routes.js.map