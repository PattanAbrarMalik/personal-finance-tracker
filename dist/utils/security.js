"use strict";
/**
 * Security utilities - encryption, hashing, tokens
 */
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
exports.InputSanitizer = exports.CORSUtils = exports.RateLimiter = exports.SecurityUtils = void 0;
const crypto = __importStar(require("crypto"));
class SecurityUtils {
    /**
     * Generate random string
     */
    static generateRandomString(length = 32) {
        return crypto.randomBytes(length).toString('hex');
    }
    /**
     * Generate UUID v4
     */
    static generateUUID() {
        return crypto.randomUUID();
    }
    /**
     * Hash with SHA256
     */
    static hash(data, salt) {
        const toHash = salt ? data + salt : data;
        return crypto.createHash('sha256').update(toHash).digest('hex');
    }
    /**
     * Generate HMAC signature
     */
    static generateHMAC(data, secret) {
        return crypto
            .createHmac('sha256', secret)
            .update(data)
            .digest('hex');
    }
    /**
     * Encrypt data (AES-256)
     */
    static encrypt(data, secret) {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-cbc', crypto.scryptSync(secret, 'salt', 32), iv);
        let encrypted = cipher.update(data, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return iv.toString('hex') + ':' + encrypted;
    }
    /**
     * Decrypt data
     */
    static decrypt(encrypted, secret) {
        const [ivHex, encryptedHex] = encrypted.split(':');
        const iv = Buffer.from(ivHex, 'hex');
        const decipher = crypto.createDecipheriv('aes-256-cbc', crypto.scryptSync(secret, 'salt', 32), iv);
        let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
    /**
     * Constant time comparison (prevent timing attacks)
     */
    static constantTimeCompare(a, b) {
        if (a.length !== b.length)
            return false;
        return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
    }
    /**
     * Generate secure token
     */
    static generateSecureToken() {
        return this.generateRandomString(32);
    }
    /**
     * Verify token hasn't been tampered with
     */
    static verifyTokenSignature(token, signature, secret) {
        const expectedSignature = this.generateHMAC(token, secret);
        return this.constantTimeCompare(signature, expectedSignature);
    }
}
exports.SecurityUtils = SecurityUtils;
/**
 * Rate limiting utilities
 */
class RateLimiter {
    maxAttempts;
    windowMs;
    attempts = new Map();
    constructor(maxAttempts = 5, windowMs = 60000) {
        this.maxAttempts = maxAttempts;
        this.windowMs = windowMs;
    }
    isAllowed(key) {
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
    getRemainingAttempts(key) {
        const record = this.attempts.get(key);
        if (!record || Date.now() > record.resetTime)
            return this.maxAttempts;
        return Math.max(0, this.maxAttempts - record.count);
    }
    reset(key) {
        this.attempts.delete(key);
    }
    clear() {
        this.attempts.clear();
    }
}
exports.RateLimiter = RateLimiter;
/**
 * CORS utilities
 */
class CORSUtils {
    static isOriginAllowed(origin, allowedOrigins) {
        return allowedOrigins.some(allowed => {
            if (allowed === '*')
                return true;
            if (allowed.includes('*')) {
                const regex = new RegExp('^' + allowed.replace(/\./g, '\\.').replace(/\*/g, '.*') + '$');
                return regex.test(origin);
            }
            return origin === allowed;
        });
    }
    static generateCORSHeaders(origin, allowedOrigins) {
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
exports.CORSUtils = CORSUtils;
/**
 * Input validation and sanitization
 */
class InputSanitizer {
    /**
     * Remove HTML tags
     */
    static stripHtml(input) {
        return input.replace(/<[^>]*>/g, '');
    }
    /**
     * Escape HTML entities
     */
    static escapeHtml(input) {
        const map = {
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
    static sanitizeEmail(email) {
        return email.toLowerCase().trim();
    }
    /**
     * Sanitize URL
     */
    static sanitizeUrl(url) {
        try {
            const parsed = new URL(url);
            return parsed.toString();
        }
        catch {
            return '';
        }
    }
    /**
     * Prevent SQL injection-like patterns
     */
    static containsSuspiciousPatterns(input) {
        const patterns = [
            /(\bunion\b|\bselect\b|\binsert\b|\bupdate\b|\bdelete\b|\bdrop\b)/i,
            /(-{2}|\/\*|\*\/|;)/,
            /(\x00|\x1a)/,
        ];
        return patterns.some(pattern => pattern.test(input));
    }
}
exports.InputSanitizer = InputSanitizer;
//# sourceMappingURL=security.js.map