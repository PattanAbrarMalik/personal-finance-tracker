import crypto from 'crypto';

/**
 * Encryption utilities for sensitive data
 * Uses AES-256-GCM encryption
 */

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-key-change-in-production';
const ALGORITHM = 'aes-256-gcm';

/**
 * Derive a 32-byte key from the encryption key
 * @param key - The encryption key
 * @returns 32-byte derived key
 */
function deriveKey(key: string): Buffer {
  // Hash the key to get a consistent 32-byte key
  return crypto.createHash('sha256').update(key).digest();
}

/**
 * Encrypt sensitive data
 * @param data - Data to encrypt
 * @returns Encrypted data with IV and auth tag
 */
export function encrypt(data: string): string {
  try {
    const key = deriveKey(ENCRYPTION_KEY);
    const iv = crypto.randomBytes(16); // Initialization vector
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    // Return IV:authTag:encrypted data
    const result = `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
    return result;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Decrypt sensitive data
 * @param encryptedData - Encrypted data (IV:authTag:data format)
 * @returns Decrypted original data
 */
export function decrypt(encryptedData: string): string {
  try {
    const key = deriveKey(ENCRYPTION_KEY);
    const parts = encryptedData.split(':');

    if (parts.length !== 3) {
      throw new Error('Invalid encrypted data format');
    }

    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const encrypted = parts[2];

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
}

/**
 * Hash sensitive data (one-way, for verification)
 * @param data - Data to hash
 * @returns Hashed data
 */
export function hash(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Compare hashed data
 * @param data - Original data
 * @param hashed - Hashed data to compare
 * @returns Boolean indicating if they match
 */
export function compareHash(data: string, hashed: string): boolean {
  const dataHash = hash(data);
  return dataHash === hashed;
}

/**
 * Generate a random token
 * @param length - Length of token (default 32)
 * @returns Random hex token
 */
export function generateToken(length: number = 32): string {
  return crypto.randomBytes(length / 2).toString('hex');
}

/**
 * Mask sensitive data for display (show last 4 chars)
 * @param data - Data to mask
 * @returns Masked data
 */
export function maskSensitiveData(data: string): string {
  if (data.length <= 4) {
    return '****';
  }
  return '*'.repeat(data.length - 4) + data.slice(-4);
}
