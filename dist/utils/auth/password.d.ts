/**
 * Hash a plain text password
 */
export declare const hashPassword: (password: string) => Promise<string>;
/**
 * Compare a plain text password with a hashed password
 */
export declare const comparePassword: (plainPassword: string, hashedPassword: string) => Promise<boolean>;
//# sourceMappingURL=password.d.ts.map