import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from '../utils/errors';

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = new NotFoundError(`Route ${req.method} ${req.path}`);
  next(error);
};









