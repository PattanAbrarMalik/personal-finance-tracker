import { AppError } from './AppError';
export declare class ValidationError extends AppError {
    readonly details?: Record<string, string[]>;
    constructor(message?: string, details?: Record<string, string[]>);
}
//# sourceMappingURL=ValidationError.d.ts.map