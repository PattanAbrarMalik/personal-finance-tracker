"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTestTransaction = exports.createTestCategory = exports.createTestUser = void 0;
const prisma_1 = require("../../utils/prisma");
const password_1 = require("../../utils/auth/password");
const jwt_1 = require("../../utils/auth/jwt");
/**
 * Create a test user and return user data with token
 */
const createTestUser = async (email = 'test@example.com', password = 'Test1234', name = 'Test User') => {
    const hashedPassword = await (0, password_1.hashPassword)(password);
    const user = await prisma_1.prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
        },
    });
    const token = (0, jwt_1.generateToken)({
        userId: user.id,
        email: user.email,
    });
    return {
        id: user.id,
        email: user.email,
        name: user.name,
        password, // Return plain password for testing
        token,
    };
};
exports.createTestUser = createTestUser;
/**
 * Create a test category
 */
const createTestCategory = async (userId, name = 'Test Category', color = '#3B82F6') => {
    return prisma_1.prisma.category.create({
        data: {
            userId,
            name,
            color,
        },
    });
};
exports.createTestCategory = createTestCategory;
/**
 * Create a test transaction
 */
const createTestTransaction = async (userId, amount = 100.0, type = 'EXPENSE', categoryId) => {
    return prisma_1.prisma.transaction.create({
        data: {
            userId,
            amount,
            description: 'Test transaction',
            type,
            categoryId,
            date: new Date(),
        },
        include: {
            category: true,
        },
    });
};
exports.createTestTransaction = createTestTransaction;
//# sourceMappingURL=test-helpers.js.map