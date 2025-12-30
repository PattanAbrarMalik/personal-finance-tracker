"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTwoFactorSecret = generateTwoFactorSecret;
exports.verifyTwoFactorToken = verifyTwoFactorToken;
exports.generateBackupCodes = generateBackupCodes;
exports.verifyAndConsumeBackupCode = verifyAndConsumeBackupCode;
exports.getBackupCodesCount = getBackupCodesCount;
const speakeasy_1 = __importDefault(require("speakeasy"));
const qrcode_1 = __importDefault(require("qrcode"));
/**
 * Generate a new 2FA secret for a user
 * @param userEmail - User's email for the secret label
 * @returns Object containing secret and QR code
 */
async function generateTwoFactorSecret(userEmail) {
    try {
        // Generate secret
        const secret = speakeasy_1.default.generateSecret({
            name: `FinTrack (${userEmail})`,
            issuer: 'FinTrack',
            length: 32,
        });
        // Generate QR code
        const qrCode = await qrcode_1.default.toDataURL(secret.otpauth_url);
        return {
            secret: secret.base32,
            qrCode,
            manualEntryKey: secret.base32, // For manual entry in authenticator apps
        };
    }
    catch (error) {
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
function verifyTwoFactorToken(secret, token) {
    try {
        // Allow for time drift of ±1 time step (30 seconds)
        const isValid = speakeasy_1.default.totp.verify({
            secret,
            encoding: 'base32',
            token,
            window: 1, // Allow 1 time step drift (±30 seconds)
        });
        return isValid;
    }
    catch (error) {
        console.error('Error verifying 2FA token:', error);
        return false;
    }
}
/**
 * Generate backup codes for 2FA recovery
 * @returns Array of 8 backup codes
 */
function generateBackupCodes() {
    const codes = [];
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
function verifyAndConsumeBackupCode(backupCodesJson, code) {
    try {
        if (!backupCodesJson) {
            return { isValid: false };
        }
        const codes = JSON.parse(backupCodesJson);
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
    }
    catch (error) {
        console.error('Error verifying backup code:', error);
        return { isValid: false };
    }
}
/**
 * Get remaining backup codes count
 * @param backupCodesJson - JSON string of backup codes
 * @returns Number of remaining codes
 */
function getBackupCodesCount(backupCodesJson) {
    try {
        if (!backupCodesJson) {
            return 0;
        }
        const codes = JSON.parse(backupCodesJson);
        return codes.length;
    }
    catch (error) {
        return 0;
    }
}
//# sourceMappingURL=two-factor.js.map