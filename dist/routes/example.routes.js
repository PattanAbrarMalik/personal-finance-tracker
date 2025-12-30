"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exampleRouter = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const errorHandler_middleware_1 = require("../middleware/errorHandler.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const errors_1 = require("../utils/errors");
exports.exampleRouter = (0, express_1.Router)();
// Example route demonstrating error handling
exports.exampleRouter.get('/test-success', (0, errorHandler_middleware_1.asyncHandler)(async (req, res) => {
    res.status(200).json({
        success: true,
        data: { message: 'This is a successful response' },
    });
}));
// Example route demonstrating NotFoundError with validation
exports.exampleRouter.get('/test-not-found/:id', (0, validate_middleware_1.validate)({
    params: zod_1.z.object({
        id: zod_1.z.string().min(1, 'ID is required'),
    }),
}), (0, errorHandler_middleware_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    if (id === '404') {
        throw new errors_1.NotFoundError('Resource');
    }
    res.status(200).json({
        success: true,
        data: { id, message: 'Found' },
    });
}));
// Example route demonstrating ValidationError with Zod
exports.exampleRouter.post('/test-validation', (0, validate_middleware_1.validate)({
    body: zod_1.z.object({
        email: zod_1.z.string().email('Invalid email format'),
        age: zod_1.z.number().int().positive('Age must be a positive integer'),
    }),
}), (0, errorHandler_middleware_1.asyncHandler)(async (req, res) => {
    const { email, age } = req.body;
    res.status(200).json({
        success: true,
        data: { email, age },
    });
}));
// Example route demonstrating generic error (will be caught as 500)
exports.exampleRouter.get('/test-error', (0, errorHandler_middleware_1.asyncHandler)(async (req, res) => {
    throw new Error('This is an unexpected error');
}));
//# sourceMappingURL=example.routes.js.map