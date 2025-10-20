import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { AppError } from './errorHandler';

export function validateRequest(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        }));
        next(new AppError(400, `Validation error: ${JSON.stringify(errors)}`));
      } else {
        next(error);
      }
    }
  };
}
