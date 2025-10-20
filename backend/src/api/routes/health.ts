import { Router, Request, Response } from 'express';
import db from '../../db/connection';
import redis from '../../db/redis';

const router = Router();

router.get('/health', async (_req: Request, res: Response): Promise<void> => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: {
      database: 'unknown',
      redis: 'unknown',
    },
  };

  try {
    // Check database
    const dbHealthy = await db.healthCheck();
    health.services.database = dbHealthy ? 'healthy' : 'unhealthy';

    // Check Redis
    const redisHealthy = await redis.healthCheck();
    health.services.redis = redisHealthy ? 'healthy' : 'unhealthy';

    // Determine overall status
    if (!dbHealthy || !redisHealthy) {
      health.status = 'degraded';
      res.status(503).json(health);
      return;
    }

    res.status(200).json(health);
  } catch (error) {
    health.status = 'error';
    res.status(503).json(health);
  }
});

router.get('/health/ready', async (_req: Request, res: Response): Promise<void> => {
  try {
    const dbHealthy = await db.healthCheck();
    const redisHealthy = await redis.healthCheck();

    if (dbHealthy && redisHealthy) {
      res.status(200).json({ ready: true });
    } else {
      res.status(503).json({ ready: false });
    }
  } catch (error) {
    res.status(503).json({ ready: false });
  }
});

router.get('/health/live', (_req: Request, res: Response): void => {
  res.status(200).json({ live: true });
});

export default router;
