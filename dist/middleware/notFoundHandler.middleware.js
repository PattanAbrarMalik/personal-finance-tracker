"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = void 0;
const errors_1 = require("../utils/errors");
const notFoundHandler = (req, res, next) => {
    const error = new errors_1.NotFoundError(`Route ${req.method} ${req.path}`);
    next(error);
};
exports.notFoundHandler = notFoundHandler;
//# sourceMappingURL=notFoundHandler.middleware.js.map