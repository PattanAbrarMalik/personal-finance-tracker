/**
 * Generate a new 2FA secret for a user
 * @param userEmail - User's email for the secret label
 * @returns Object containing secret and QR code
 */
export declare function generateTwoFactorSecret(userEmail: string): Promise<{
    secret: string;
    qrCode: string;
    manualEntryKey: string;
}>;
/**
 * Verify a TOTP token
 * @param secret - The user's 2FA secret
 * @param token - The 6-digit token from authenticator app
 * @returns Boolean indicating if token is valid
 */
export declare function verifyTwoFactorToken(secret: string, token: string): boolean;
/**
 * Generate backup codes for 2FA recovery
 * @returns Array of 8 backup codes
 */
export declare function generateBackupCodes(): string[];
/**
 * Verify and consume a backup code
 * @param backupCodesJson - JSON string of backup codes
 * @param code - The code to verify
 * @returns Object with isValid boolean and updated codes list
 */
export declare function verifyAndConsumeBackupCode(backupCodesJson: string | null, code: string): {
    isValid: boolean;
    updatedCodes?: string[];
};
/**
 * Get remaining backup codes count
 * @param backupCodesJson - JSON string of backup codes
 * @returns Number of remaining codes
 */
export declare function getBackupCodesCount(backupCodesJson: string | null): number;
//# sourceMappingURL=two-factor.d.ts.map