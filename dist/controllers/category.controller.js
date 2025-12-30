"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryController = void 0;
const category_service_1 = require("../services/category.service");
const errorHandler_middleware_1 = require("../middleware/errorHandler.middleware");
exports.categoryController = {
    getAll: (0, errorHandler_middleware_1.asyncHandler)(async (req, res) => {
        const categories = await (0, category_service_1.getCategories)(req.user.userId);
        res.status(200).json({
            success: true,
            data: { categories },
        });
    }),
    getById: (0, errorHandler_middleware_1.asyncHandler)(async (req, res) => {
        const category = await (0, category_service_1.getCategoryById)(req.params.id, req.user.userId);
        res.status(200).json({
            success: true,
            data: { category },
        });
    }),
    create: (0, errorHandler_middleware_1.asyncHandler)(async (req, res) => {
        const category = await (0, category_service_1.createCategory)(req.user.userId, req.body);
        res.status(201).json({
            success: true,
            data: { category },
        });
    }),
    update: (0, errorHandler_middleware_1.asyncHandler)(async (req, res) => {
        const category = await (0, category_service_1.updateCategory)(req.params.id, req.user.userId, req.body);
        res.status(200).json({
            success: true,
            data: { category },
        });
    }),
    delete: (0, errorHandler_middleware_1.asyncHandler)(async (req, res) => {
        await (0, category_service_1.deleteCategory)(req.params.id, req.user.userId);
        res.status(200).json({
            success: true,
            message: 'Category deleted successfully',
        });
    }),
};
//# sourceMappingURL=category.controller.js.map