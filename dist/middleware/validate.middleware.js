"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const errors_1 = require("../utils/errors");
const errorHandler_middleware_1 = require("./errorHandler.middleware");
/**
 * Validates request body, query, or params using Zod schemas
 * @param schemas - Object containing Zod schemas for body, query, and/or params
 * @returns Express middleware function
 */
const validate = (schemas) => {
    return (0, errorHandler_middleware_1.asyncHandler)(async (req, res, next) => {
        const errors = {};
        // Validate body
        if (schemas.body) {
            try {
                req.body = await schemas.body.parseAsync(req.body);
            }
            catch (error) {
                if (error instanceof zod_1.ZodError) {
                    error.errors.forEach((err) => {
                        const path = err.path.join('.');
                        if (!errors[path]) {
                            errors[path] = [];
                        }
                        errors[path].push(err.message);
                    });
                }
            }
        }
        // Validate query
        if (schemas.query) {
            try {
                req.query = await schemas.query.parseAsync(req.query);
            }
            catch (error) {
                if (error instanceof zod_1.ZodError) {
                    error.errors.forEach((err) => {
                        const path = `query.${err.path.join('.')}`;
                        if (!errors[path]) {
                            errors[path] = [];
                        }
                        errors[path].push(err.message);
                    });
                }
            }
        }
        // Validate params
        if (schemas.params) {
            try {
                req.params = await schemas.params.parseAsync(req.params);
            }
            catch (error) {
                if (error instanceof zod_1.ZodError) {
                    error.errors.forEach((err) => {
                        const path = `params.${err.path.join('.')}`;
                        if (!errors[path]) {
                            errors[path] = [];
                        }
                        errors[path].push(err.message);
                    });
                }
            }
        }
        // If there are validation errors, throw ValidationError
        if (Object.keys(errors).length > 0) {
            throw new errors_1.ValidationError('Validation failed', errors);
        }
        next();
    });
};
exports.validate = validate;
//# sourceMappingURL=validate.middleware.js.map