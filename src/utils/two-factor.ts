import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

/**
 * Generate a new 2FA secret for a user
 * @param userEmail - User's email for the secret label
 * @returns Object containing secret and QR code
 */
export async function generateTwoFactorSecret(userEmail: string) {
  try {
    // Generate secret
    const secret = speakeasy.generateSecret({
      name: `FinTrack (${userEmail})`,
      issuer: 'FinTrack',
      length: 32,
    });

    // Generate QR code
    const qrCode = await QRCode.toDataURL(secret.otpauth_url!);

    return {
      secret: secret.base32,
      qrCode,
      manualEntryKey: secret.base32, // For manual entry in authenticator apps
    };
  } catch (error) {
    console.error('Error generating 2FA secret:', error);
    throw new Error('Failed to generate 2FA secret');
  }
}

/**
 * Verify a TOTP token
 * @param secret - The user's 2FA secret
 * @param token - The 6-digit token from authenticator app
 * @returns Boolean indicating if token is valid
 */
export function verifyTwoFactorToken(secret: string, token: string): boolean {
  try {
    // Allow for time drift of ±1 time step (30 seconds)
    const isValid = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 1, // Allow 1 time step drift (±30 seconds)
    });

    return isValid;
  } catch (error) {
    console.error('Error verifying 2FA token:', error);
    return false;
  }
}

/**
 * Generate backup codes for 2FA recovery
 * @returns Array of 8 backup codes
 */
export function generateBackupCodes(): string[] {
  const codes: string[] = [];
  
  for (let i = 0; i < 8; i++) {
    // Generate 8-character alphanumeric codes
    const code = Math.random()
      .toString(36)
      .substring(2, 10)
      .toUpperCase();
    codes.push(code);
  }

  return codes;
}

/**
 * Verify and consume a backup code
 * @param backupCodesJson - JSON string of backup codes
 * @param code - The code to verify
 * @returns Object with isValid boolean and updated codes list
 */
export function verifyAndConsumeBackupCode(
  backupCodesJson: string | null,
  code: string
): { isValid: boolean; updatedCodes?: string[] } {
  try {
    if (!backupCodesJson) {
      return { isValid: false };
    }

    const codes: string[] = JSON.parse(backupCodesJson);
    const codeIndex = codes.indexOf(code.toUpperCase());

    if (codeIndex === -1) {
      return { isValid: false };
    }

    // Remove used code
    codes.splice(codeIndex, 1);

    return {
      isValid: true,
      updatedCodes: codes,
    };
  } catch (error) {
    console.error('Error verifying backup code:', error);
    return { isValid: false };
  }
}

/**
 * Get remaining backup codes count
 * @param backupCodesJson - JSON string of backup codes
 * @returns Number of remaining codes
 */
export function getBackupCodesCount(backupCodesJson: string | null): number {
  try {
    if (!backupCodesJson) {
      return 0;
    }
    const codes: string[] = JSON.parse(backupCodesJson);
    return codes.length;
  } catch (error) {
    return 0;
  }
}
