"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const auth_service_1 = require("../services/auth.service");
const errorHandler_middleware_1 = require("../middleware/errorHandler.middleware");
exports.authController = {
    register: (0, errorHandler_middleware_1.asyncHandler)(async (req, res) => {
        const result = await (0, auth_service_1.register)(req.body);
        res.status(201).json({
            success: true,
            data: result,
        });
    }),
    login: (0, errorHandler_middleware_1.asyncHandler)(async (req, res) => {
        const result = await (0, auth_service_1.login)(req.body);
        res.status(200).json({
            success: true,
            data: result,
        });
    }),
    me: (0, errorHandler_middleware_1.asyncHandler)(async (req, res) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: {
                    message: 'Unauthorized',
                    statusCode: 401,
                },
            });
        }
        const user = await (0, auth_service_1.getCurrentUser)(req.user.userId);
        res.status(200).json({
            success: true,
            data: { user },
        });
    }),
    googleLogin: (0, errorHandler_middleware_1.asyncHandler)(async (req, res) => {
        const result = await (0, auth_service_1.googleLogin)(req.body);
        res.status(200).json({
            success: true,
            data: result,
        });
    }),
    appleLogin: (0, errorHandler_middleware_1.asyncHandler)(async (req, res) => {
        const result = await (0, auth_service_1.appleLogin)(req.body);
        res.status(200).json({
            success: true,
            data: result,
        });
    }),
};
//# sourceMappingURL=auth.controller.js.map