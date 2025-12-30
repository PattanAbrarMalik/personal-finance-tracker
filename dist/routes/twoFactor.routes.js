"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const twoFactorController = __importStar(require("../controllers/twoFactor.controller"));
const router = (0, express_1.Router)();
/**
 * 2FA Routes
 * All routes require authentication
 */
// Setup 2FA - Generate secret and QR code
router.post('/setup', twoFactorController.setupTwoFactor);
// Verify 2FA setup and enable it
router.post('/verify', twoFactorController.verifyTwoFactor);
// Disable 2FA
router.post('/disable', twoFactorController.disableTwoFactor);
// Get 2FA status
router.get('/status', twoFactorController.getTwoFactorStatus);
// Regenerate backup codes
router.post('/regenerate-backup-codes', twoFactorController.regenerateBackupCodes);
// Verify 2FA token during login
router.post('/verify-token', twoFactorController.verifyTwoFactorTokenLogin);
exports.default = router;
//# sourceMappingURL=twoFactor.routes.js.map