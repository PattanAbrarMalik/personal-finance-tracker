/**
 * Encrypt sensitive data
 * @param data - Data to encrypt
 * @returns Encrypted data with IV and auth tag
 */
export declare function encrypt(data: string): string;
/**
 * Decrypt sensitive data
 * @param encryptedData - Encrypted data (IV:authTag:data format)
 * @returns Decrypted original data
 */
export declare function decrypt(encryptedData: string): string;
/**
 * Hash sensitive data (one-way, for verification)
 * @param data - Data to hash
 * @returns Hashed data
 */
export declare function hash(data: string): string;
/**
 * Compare hashed data
 * @param data - Original data
 * @param hashed - Hashed data to compare
 * @returns Boolean indicating if they match
 */
export declare function compareHash(data: string, hashed: string): boolean;
/**
 * Generate a random token
 * @param length - Length of token (default 32)
 * @returns Random hex token
 */
export declare function generateToken(length?: number): string;
/**
 * Mask sensitive data for display (show last 4 chars)
 * @param data - Data to mask
 * @returns Masked data
 */
export declare function maskSensitiveData(data: string): string;
//# sourceMappingURL=encryption.d.ts.map