"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appleLogin = exports.googleLogin = exports.getCurrentUser = exports.login = exports.register = void 0;
const prisma_1 = require("../utils/prisma");
const password_1 = require("../utils/auth/password");
const jwt_1 = require("../utils/auth/jwt");
const errors_1 = require("../utils/errors");
/**
 * Register a new user
 */
const register = async (data) => {
    // Check if user already exists
    const existingUser = await prisma_1.prisma.user.findUnique({
        where: { email: data.email },
    });
    if (existingUser) {
        throw new errors_1.ValidationError('Email already registered', {
            email: ['Email is already in use'],
        });
    }
    // Hash password
    const hashedPassword = await (0, password_1.hashPassword)(data.password);
    // Create user
    const user = await prisma_1.prisma.user.create({
        data: {
            email: data.email,
            password: hashedPassword,
            name: data.name,
        },
        select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    // Generate token
    const token = (0, jwt_1.generateToken)({
        userId: user.id,
        email: user.email,
    });
    return {
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
        },
        token,
    };
};
exports.register = register;
/**
 * Login a user
 */
const login = async (data) => {
    // Find user by email
    const user = await prisma_1.prisma.user.findUnique({
        where: { email: data.email },
    });
    if (!user) {
        throw new errors_1.UnauthorizedError('Invalid email or password');
    }
    // Verify password
    const isPasswordValid = await (0, password_1.comparePassword)(data.password, user.password);
    if (!isPasswordValid) {
        throw new errors_1.UnauthorizedError('Invalid email or password');
    }
    // Generate token
    const token = (0, jwt_1.generateToken)({
        userId: user.id,
        email: user.email,
    });
    return {
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
        },
        token,
    };
};
exports.login = login;
/**
 * Get current user by ID
 */
const getCurrentUser = async (userId) => {
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return user;
};
exports.getCurrentUser = getCurrentUser;
/**
 * Google Login / Sign Up
 */
const googleLogin = async (data) => {
    try {
        // In production, verify the Google token here using google-auth-library
        // For now, we'll accept any token and create/find user with a demo email
        // Demo implementation - In production, decode and verify the JWT token
        const demoEmail = `google-user-${Date.now()}@google.com`;
        const demoName = 'Google User';
        // Try to find existing user by email
        let user = await prisma_1.prisma.user.findFirst({
            where: { email: demoEmail },
        });
        // If user doesn't exist, create one
        if (!user) {
            user = await prisma_1.prisma.user.create({
                data: {
                    email: demoEmail,
                    name: demoName,
                    password: 'oauth-google', // OAuth users don't have passwords
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                },
            });
        }
        // Generate token
        const token = (0, jwt_1.generateToken)({
            userId: user.id,
            email: user.email,
        });
        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
            token,
        };
    }
    catch (error) {
        throw new errors_1.UnauthorizedError('Google authentication failed');
    }
};
exports.googleLogin = googleLogin;
/**
 * Apple Login / Sign Up
 */
const appleLogin = async (data) => {
    try {
        // In production, verify the Apple token here
        // For now, we'll accept and create/find user with a demo email
        // Demo implementation - In production, decode and verify the JWT token
        const demoEmail = `apple-user-${Date.now()}@apple.com`;
        const demoName = 'Apple User';
        // Try to find existing user by email
        let user = await prisma_1.prisma.user.findFirst({
            where: { email: demoEmail },
        });
        // If user doesn't exist, create one
        if (!user) {
            user = await prisma_1.prisma.user.create({
                data: {
                    email: demoEmail,
                    name: demoName,
                    password: 'oauth-apple', // OAuth users don't have passwords
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                },
            });
        }
        // Generate token
        const token = (0, jwt_1.generateToken)({
            userId: user.id,
            email: user.email,
        });
        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
            token,
        };
    }
    catch (error) {
        throw new errors_1.UnauthorizedError('Apple authentication failed');
    }
};
exports.appleLogin = appleLogin;
//# sourceMappingURL=auth.service.js.map