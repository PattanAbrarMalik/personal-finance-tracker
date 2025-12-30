"use strict";
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
exports.healthController = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
// #region agent log
const logDebug = (location, message, data, hypothesisId) => {
    try {
        const logEntry = JSON.stringify({
            location,
            message,
            data,
            timestamp: Date.now(),
            sessionId: 'debug-session',
            runId: 'run1',
            hypothesisId,
        }) + '\n';
        const logPath = path.join(process.cwd(), '..', '.cursor', 'debug.log');
        fs.appendFileSync(logPath, logEntry, 'utf8');
    }
    catch (e) { }
};
// #endregion
exports.healthController = {
    check: (req, res) => {
        // #region agent log
        logDebug('backend/src/controllers/health.controller.ts:18', 'Health check called', { method: req.method, url: req.url, headers: req.headers.origin }, 'C');
        // #endregion
        res.status(200).json({
            success: true,
            data: {
                status: 'ok',
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
            },
        });
        // #region agent log
        logDebug('backend/src/controllers/health.controller.ts:28', 'Health check response sent', { statusCode: 200 }, 'C');
        // #endregion
    },
};
//# sourceMappingURL=health.controller.js.map