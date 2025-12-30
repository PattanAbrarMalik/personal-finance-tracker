"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
// Validation schemas
const updateProfileSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(100).optional(),
    email: zod_1.z.string().email().optional(),
});
const changePasswordSchema = zod_1.z.object({
    currentPassword: zod_1.z.string().min(1),
    newPassword: zod_1.z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: zod_1.z.string().min(1),
});
const deleteAccountSchema = zod_1.z.object({
    password: zod_1.z.string().min(1),
});
// All routes require authentication
router.use(auth_middleware_1.authenticate);
// Get user profile
router.get('/profile', user_controller_1.userController.getProfile);
// Update user profile
router.put('/profile', (0, validate_middleware_1.validate)({ body: updateProfileSchema }), user_controller_1.userController.updateProfile);
// Change password
router.post('/change-password', (0, validate_middleware_1.validate)({ body: changePasswordSchema }), user_controller_1.userController.changePassword);
// Delete account
router.delete('/account', (0, validate_middleware_1.validate)({ body: deleteAccountSchema }), user_controller_1.userController.deleteAccount);
exports.default = router;
//# sourceMappingURL=user.routes.js.map