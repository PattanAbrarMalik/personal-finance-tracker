/**
 * Security utilities - encryption, hashing, tokens
 */

import * as crypto from 'crypto';

export class SecurityUtils {
  /**
   * Generate random string
   */
  static generateRandomString(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Generate UUID v4
   */
  static generateUUID(): string {
    return crypto.randomUUID();
  }

  /**
   * Hash with SHA256
   */
  static hash(data: string, salt?: string): string {
    const toHash = salt ? data + salt : data;
    return crypto.createHash('sha256').update(toHash).digest('hex');
  }

  /**
   * Generate HMAC signature
   */
  static generateHMAC(data: string, secret: string): string {
    return crypto
      .createHmac('sha256', secret)
      .update(data)
      .digest('hex');
  }

  /**
   * Encrypt data (AES-256)
   */
  static encrypt(data: string, secret: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      'aes-256-cbc',
      crypto.scryptSync(secret, 'salt', 32),
      iv
    );
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  }

  /**
   * Decrypt data
   */
  static decrypt(encrypted: string, secret: string): string {
    const [ivHex, encryptedHex] = encrypted.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      crypto.scryptSync(secret, 'salt', 32),
      iv
    );
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  /**
   * Constant time comparison (prevent timing attacks)
   */
  static constantTimeCompare(a: string, b: string): boolean {
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
  }

  /**
   * Generate secure token
   */
  static generateSecureToken(): string {
    return this.generateRandomString(32);
  }

  /**
   * Verify token hasn't been tampered with
   */
  static verifyTokenSignature(token: string, signature: string, secret: string): boolean {
    const expectedSignature = this.generateHMAC(token, secret);
    return this.constantTimeCompare(signature, expectedSignature);
  }
}

/**
 * Rate limiting utilities
 */
export class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();

  constructor(private maxAttempts: number = 5, private windowMs: number = 60000) {}

  isAllowed(key: string): boolean {
    const now = Date.now();
    const record = this.attempts.get(key);

    if (!record || now > record.resetTime) {
      this.attempts.set(key, { count: 1, resetTime: now + this.windowMs });
      return true;
    }

    if (record.count < this.maxAttempts) {
      record.count++;
      return true;
    }

    return false;
  }

  getRemainingAttempts(key: string): number {
    const record = this.attempts.get(key);
    if (!record || Date.now() > record.resetTime) return this.maxAttempts;
    return Math.max(0, this.maxAttempts - record.count);
  }

  reset(key: string): void {
    this.attempts.delete(key);
  }

  clear(): void {
    this.attempts.clear();
  }
}

/**
 * CORS utilities
 */
export class CORSUtils {
  static isOriginAllowed(origin: string, allowedOrigins: string[]): boolean {
    return allowedOrigins.some(allowed => {
      if (allowed === '*') return true;
      if (allowed.includes('*')) {
        const regex = new RegExp(
          '^' + allowed.replace(/\./g, '\\.').replace(/\*/g, '.*') + '$'
        );
        return regex.test(origin);
      }
      return origin === allowed;
    });
  }

  static generateCORSHeaders(origin: string, allowedOrigins: string[]) {
    const isAllowed = this.isOriginAllowed(origin, allowedOrigins);
    return {
      'Access-Control-Allow-Origin': isAllowed ? origin : allowedOrigins[0],
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
      'Access-Control-Allow-Credentials': 'true',
    };
  }
}

/**
 * Input validation and sanitization
 */
export class InputSanitizer {
  /**
   * Remove HTML tags
   */
  static stripHtml(input: string): string {
    return input.replace(/<[^>]*>/g, '');
  }

  /**
   * Escape HTML entities
   */
  static escapeHtml(input: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return input.replace(/[&<>"']/g, char => map[char]);
  }

  /**
   * Sanitize email
   */
  static sanitizeEmail(email: string): string {
    return email.toLowerCase().trim();
  }

  /**
   * Sanitize URL
   */
  static sanitizeUrl(url: string): string {
    try {
      const parsed = new URL(url);
      return parsed.toString();
    } catch {
      return '';
    }
  }

  /**
   * Prevent SQL injection-like patterns
   */
  static containsSuspiciousPatterns(input: string): boolean {
    const patterns = [
      /(\bunion\b|\bselect\b|\binsert\b|\bupdate\b|\bdelete\b|\bdrop\b)/i,
      /(-{2}|\/\*|\*\/|;)/,
      /(\x00|\x1a)/,
    ];
    return patterns.some(pattern => pattern.test(input));
  }
}
