export interface RegisterData {
    email: string;
    password: string;
    name?: string;
}
export interface LoginData {
    email: string;
    password: string;
}
export interface AuthResponse {
    user: {
        id: string;
        email: string;
        name: string | null;
    };
    token: string;
}
/**
 * Register a new user
 */
export declare const register: (data: RegisterData) => Promise<AuthResponse>;
/**
 * Login a user
 */
export declare const login: (data: LoginData) => Promise<AuthResponse>;
/**
 * Get current user by ID
 */
export declare const getCurrentUser: (userId: string) => Promise<{
    id: string;
    email: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}>;
/**
 * Google Login / Sign Up
 */
export declare const googleLogin: (data: {
    token: string;
}) => Promise<AuthResponse>;
/**
 * Apple Login / Sign Up
 */
export declare const appleLogin: (data: {
    token?: string;
}) => Promise<AuthResponse>;
//# sourceMappingURL=auth.service.d.ts.map