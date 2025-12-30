"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const logger_1 = require("./logger");
// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices
const globalForPrisma = global;
exports.prisma = globalForPrisma.prisma ||
    new client_1.PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = exports.prisma;
}
// Handle Prisma connection errors
exports.prisma.$on('error', (e) => {
    logger_1.logger.error('Prisma error occurred', e);
});
// Graceful shutdown
process.on('beforeExit', async () => {
    await exports.prisma.$disconnect();
    logger_1.logger.info('Prisma client disconnected');
});
exports.default = exports.prisma;
//# sourceMappingURL=prisma.js.map