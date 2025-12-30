import { AppError } from './AppError';

export class ValidationError extends AppError {
  public readonly details?: Record<string, string[]>;

  constructor(
    message: string = 'Validation failed',
    details?: Record<string, string[]>
  ) {
    super(message, 400, true, 'VALIDATION_ERROR');
    this.details = details;
  }
}









