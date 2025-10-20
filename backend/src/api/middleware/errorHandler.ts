import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  // Log unexpected errors
  console.error('Unexpected error:', err);

  return res.status(500).json({
    status: 'error',
    message: 'An unexpected error occurred',
  });
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`,
  });
}
