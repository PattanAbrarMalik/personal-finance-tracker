"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionController = void 0;
const transaction_service_1 = require("../services/transaction.service");
const errorHandler_middleware_1 = require("../middleware/errorHandler.middleware");
exports.transactionController = {
    getAll: (0, errorHandler_middleware_1.asyncHandler)(async (req, res) => {
        const result = await (0, transaction_service_1.getTransactions)(req.user.userId, req.query);
        res.status(200).json({
            success: true,
            data: result,
        });
    }),
    getById: (0, errorHandler_middleware_1.asyncHandler)(async (req, res) => {
        const transaction = await (0, transaction_service_1.getTransactionById)(req.params.id, req.user.userId);
        res.status(200).json({
            success: true,
            data: { transaction },
        });
    }),
    create: (0, errorHandler_middleware_1.asyncHandler)(async (req, res) => {
        const transaction = await (0, transaction_service_1.createTransaction)(req.user.userId, req.body);
        res.status(201).json({
            success: true,
            data: { transaction },
        });
    }),
    update: (0, errorHandler_middleware_1.asyncHandler)(async (req, res) => {
        const transaction = await (0, transaction_service_1.updateTransaction)(req.params.id, req.user.userId, req.body);
        res.status(200).json({
            success: true,
            data: { transaction },
        });
    }),
    delete: (0, errorHandler_middleware_1.asyncHandler)(async (req, res) => {
        await (0, transaction_service_1.deleteTransaction)(req.params.id, req.user.userId);
        res.status(200).json({
            success: true,
            message: 'Transaction deleted successfully',
        });
    }),
    getStats: (0, errorHandler_middleware_1.asyncHandler)(async (req, res) => {
        const stats = await (0, transaction_service_1.getTransactionStats)(req.user.userId, req.query.startDate ? new Date(req.query.startDate) : undefined, req.query.endDate ? new Date(req.query.endDate) : undefined);
        res.status(200).json({
            success: true,
            data: { stats },
        });
    }),
};
//# sourceMappingURL=transaction.controller.js.map