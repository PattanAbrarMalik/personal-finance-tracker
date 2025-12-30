"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("../index"));
(0, vitest_1.describe)('Health Check', () => {
    (0, vitest_1.it)('should return health status', async () => {
        const response = await (0, supertest_1.default)(index_1.default).get('/api/health');
        (0, vitest_1.expect)(response.status).toBe(200);
        (0, vitest_1.expect)(response.body.success).toBe(true);
        (0, vitest_1.expect)(response.body.data.status).toBe('ok');
        (0, vitest_1.expect)(response.body.data.timestamp).toBeDefined();
        (0, vitest_1.expect)(response.body.data.uptime).toBeDefined();
    });
});
//# sourceMappingURL=health.test.js.map