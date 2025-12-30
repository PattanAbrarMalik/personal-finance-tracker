import { Request, Response } from 'express';
/**
 * Setup 2FA - Generate secret and QR code
 * POST /api/2fa/setup
 */
export declare function setupTwoFactor(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
/**
 * Verify 2FA and enable it
 * POST /api/2fa/verify
 */
export declare function verifyTwoFactor(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
/**
 * Disable 2FA
 * POST /api/2fa/disable
 */
export declare function disableTwoFactor(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
/**
 * Get 2FA status and remaining backup codes count
 * GET /api/2fa/status
 */
export declare function getTwoFactorStatus(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
/**
 * Regenerate backup codes
 * POST /api/2fa/regenerate-backup-codes
 */
export declare function regenerateBackupCodes(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
/**
 * Verify 2FA token during login (used as fallback)
 * POST /api/2fa/verify-token
 */
export declare function verifyTwoFactorTokenLogin(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=twoFactor.controller.d.ts.map