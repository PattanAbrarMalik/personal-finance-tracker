import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

// #region agent log
const logDebug = (location: string, message: string, data: any, hypothesisId: string) => {
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
  } catch (e) {}
};
// #endregion

export const healthController = {
  check: (req: Request, res: Response) => {
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

