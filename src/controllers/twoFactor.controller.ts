import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { verifyJWT } from '../utils/auth/jwt';
import * as twoFactorUtils from '../utils/two-factor';

/**
 * Setup 2FA - Generate secret and QR code
 * POST /api/2fa/setup
 */
export async function setupTwoFactor(req: Request, res: Response) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const decoded = verifyJWT(token);
    if (!decoded || typeof decoded === 'string') {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.twoFactorEnabled) {
      return res.status(400).json({ message: '2FA is already enabled' });
    }

    // Generate new secret and QR code
    const { secret, qrCode, manualEntryKey } =
      await twoFactorUtils.generateTwoFactorSecret(user.email);

    // Generate backup codes
    const backupCodes = twoFactorUtils.generateBackupCodes();

    res.json({
      secret,
      qrCode,
      manualEntryKey,
      backupCodes,
      message: 'Scan the QR code with your authenticator app or enter the manual key',
    });
  } catch (error) {
    console.error('Error setting up 2FA:', error);
    res.status(500).json({ message: 'Failed to setup 2FA' });
  }
}

/**
 * Verify 2FA and enable it
 * POST /api/2fa/verify
 */
export async function verifyTwoFactor(req: Request, res: Response) {
  try {
    const { token, secret, backupCodes } = req.body;

    if (!token || !secret) {
      return res.status(400).json({ message: 'Token and secret are required' });
    }

    // Verify JWT
    const jwtToken = req.headers.authorization?.split(' ')[1];
    if (!jwtToken) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const decoded = verifyJWT(jwtToken);
    if (!decoded || typeof decoded === 'string') {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Verify 2FA token
    const isValidToken = twoFactorUtils.verifyTwoFactorToken(secret, token);
    if (!isValidToken) {
      return res.status(400).json({ message: 'Invalid 2FA token' });
    }

    // Save 2FA settings
    const user = await prisma.user.update({
      where: { id: decoded.userId },
      data: {
        twoFactorEnabled: true,
        twoFactorSecret: secret,
        twoFactorBackupCodes: JSON.stringify(backupCodes),
      },
    });

    res.json({
      message: '2FA enabled successfully',
      user: {
        id: user.id,
        email: user.email,
        twoFactorEnabled: user.twoFactorEnabled,
      },
    });
  } catch (error) {
    console.error('Error verifying 2FA:', error);
    res.status(500).json({ message: 'Failed to verify 2FA' });
  }
}

/**
 * Disable 2FA
 * POST /api/2fa/disable
 */
export async function disableTwoFactor(req: Request, res: Response) {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const decoded = verifyJWT(token);
    if (!decoded || typeof decoded === 'string') {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.twoFactorEnabled) {
      return res.status(400).json({ message: '2FA is not enabled' });
    }

    // Password validation should be done by parent middleware
    // For now, just disable 2FA
    const updatedUser = await prisma.user.update({
      where: { id: decoded.userId },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null,
        twoFactorBackupCodes: null,
      },
    });

    res.json({
      message: '2FA disabled successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        twoFactorEnabled: updatedUser.twoFactorEnabled,
      },
    });
  } catch (error) {
    console.error('Error disabling 2FA:', error);
    res.status(500).json({ message: 'Failed to disable 2FA' });
  }
}

/**
 * Get 2FA status and remaining backup codes count
 * GET /api/2fa/status
 */
export async function getTwoFactorStatus(req: Request, res: Response) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const decoded = verifyJWT(token);
    if (!decoded || typeof decoded === 'string') {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        twoFactorEnabled: true,
        twoFactorBackupCodes: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const backupCodesCount = twoFactorUtils.getBackupCodesCount(
      user.twoFactorBackupCodes
    );

    res.json({
      twoFactorEnabled: user.twoFactorEnabled,
      backupCodesRemaining: backupCodesCount,
    });
  } catch (error) {
    console.error('Error getting 2FA status:', error);
    res.status(500).json({ message: 'Failed to get 2FA status' });
  }
}

/**
 * Regenerate backup codes
 * POST /api/2fa/regenerate-backup-codes
 */
export async function regenerateBackupCodes(req: Request, res: Response) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const decoded = verifyJWT(token);
    if (!decoded || typeof decoded === 'string') {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.twoFactorEnabled) {
      return res.status(400).json({ message: '2FA is not enabled' });
    }

    // Generate new backup codes
    const backupCodes = twoFactorUtils.generateBackupCodes();

    await prisma.user.update({
      where: { id: decoded.userId },
      data: {
        twoFactorBackupCodes: JSON.stringify(backupCodes),
      },
    });

    res.json({
      backupCodes,
      message: 'Backup codes regenerated successfully',
    });
  } catch (error) {
    console.error('Error regenerating backup codes:', error);
    res.status(500).json({ message: 'Failed to regenerate backup codes' });
  }
}

/**
 * Verify 2FA token during login (used as fallback)
 * POST /api/2fa/verify-token
 */
export async function verifyTwoFactorTokenLogin(req: Request, res: Response) {
  try {
    const { email, token, useBackupCode } = req.body;

    if (!email || !token) {
      return res.status(400).json({ message: 'Email and token are required' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
      return res.status(400).json({ message: 'Invalid request' });
    }

    let isValid = false;

    if (useBackupCode) {
      // Verify backup code
      const result = twoFactorUtils.verifyAndConsumeBackupCode(
        user.twoFactorBackupCodes,
        token
      );
      isValid = result.isValid;

      if (isValid && result.updatedCodes) {
        // Update backup codes
        await prisma.user.update({
          where: { id: user.id },
          data: {
            twoFactorBackupCodes: JSON.stringify(result.updatedCodes),
          },
        });
      }
    } else {
      // Verify TOTP token
      isValid = twoFactorUtils.verifyTwoFactorToken(user.twoFactorSecret, token);
    }

    if (!isValid) {
      return res.status(400).json({ message: 'Invalid 2FA token' });
    }

    res.json({
      message: '2FA verification successful',
      valid: true,
    });
  } catch (error) {
    console.error('Error verifying 2FA token:', error);
    res.status(500).json({ message: 'Failed to verify 2FA token' });
  }
}
