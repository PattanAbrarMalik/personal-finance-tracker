import { Router } from 'express';
import * as twoFactorController from '../controllers/twoFactor.controller';

const router = Router();

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

export default router;
