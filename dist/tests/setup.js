"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const prisma_1 = require("../utils/prisma");
// Clean up database before each test
(0, vitest_1.beforeEach)(async () => {
    // Delete all data in reverse order of dependencies
    await prisma_1.prisma.transaction.deleteMany();
    await prisma_1.prisma.budget.deleteMany();
    await prisma_1.prisma.category.deleteMany();
    await prisma_1.prisma.user.deleteMany();
});
// Close Prisma connection after all tests
(0, vitest_1.afterAll)(async () => {
    await prisma_1.prisma.$disconnect();
});
//# sourceMappingURL=setup.js.map