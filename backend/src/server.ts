import express, { Application } from 'express';
import cors from 'cors';
import config from './config';
import healthRouter from './api/routes/health';
import { errorHandler, notFoundHandler } from './api/middleware/errorHandler';
import { createRateLimiter } from './api/middleware/rateLimit';

const app: Application = express();

// Trust proxy for rate limiting and IP detection
app.set('trust proxy', 1);

// Middleware chain
app.use(
  cors({
    origin: config.security.corsOrigin,
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Global rate limiting
app.use(createRateLimiter());

// Logging middleware (simple console logging for dev)
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check routes (no rate limiting)
app.use('/', healthRouter);

// Quiz routes
import quizRouter from './api/routes/quiz';
app.use('/quiz', quizRouter);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const PORT = config.server.port;
const HOST = config.server.host;

async function startServer() {
  try {
    const server = app.listen(PORT, () => {
      console.log(`
╔═══════════════════════════════════════╗
║   AI Personality Quiz API Server     ║
║                                       ║
║   Environment: ${config.server.nodeEnv.padEnd(22)}║
║   Port: ${PORT.toString().padEnd(30)}║
║   Host: ${HOST.padEnd(30)}║
║                                       ║
║   Health: http://${HOST}:${PORT}/health${' '.repeat(6)}║
╚═══════════════════════════════════════╝
      `);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully...');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('\nSIGINT received, shutting down gracefully...');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start server if this file is run directly
if (require.main === module) {
  startServer();
}

export default app;
