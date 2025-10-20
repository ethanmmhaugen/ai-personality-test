import { Request, Response, NextFunction } from 'express';
import redis from '../../db/redis';
import config from '../../config';
import { AppError } from './errorHandler';

interface RateLimitOptions {
  windowMs: number;
  maxRequests: number;
  keyGenerator?: (req: Request) => string;
}

export function createRateLimiter(options: Partial<RateLimitOptions> = {}) {
  const windowMs = options.windowMs || config.security.rateLimitWindowMs;
  const maxRequests = options.maxRequests || config.security.rateLimitMaxRequests;
  const keyGenerator = options.keyGenerator || ((req: Request) => req.ip || 'unknown');

  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const key = `ratelimit:${keyGenerator(req)}`;
      const client = redis.getClient();

      const current = await client.incr(key);

      if (current === 1) {
        await client.expire(key, Math.ceil(windowMs / 1000));
      }

      if (current > maxRequests) {
        throw new AppError(429, 'Too many requests. Please try again later.');
      }

      next();
    } catch (error) {
      if (error instanceof AppError) {
        next(error);
      } else {
        console.error('Rate limit error:', error);
        // Fail open - don't block requests if rate limiting fails
        next();
      }
    }
  };
}

