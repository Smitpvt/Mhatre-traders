import app from './app.js';
import { env } from './config/env.js';
import { logger } from './middlewares/logging.middleware.js';
import prisma from './lib/prisma.js';

// Warm up database connection pool on startup
const server = app.listen(env.PORT, () => {
  logger.info(`🚀 Server initialized in [${env.NODE_ENV}] mode on port: ${env.PORT}`);
  prisma.$connect()
    .then(() => logger.info('Database connection pool warmed up successfully.'))
    .catch((err) => logger.error('Database connection warmup failed:', err.message));
});

// Graceful termination handler
const shutdown = (signal) => {
  logger.warn(`Process received ${signal}. Beginning graceful shutdown...`);
  
  server.close(async () => {
    try {
      await prisma.$disconnect();
      logger.info('Database client disconnected cleanly.');
    } catch (err) {
      logger.error({ msg: 'Database disconnection failed during shutdown', error: err.message });
    }
    logger.info('HTTP connections closed. Server execution terminated.');
    process.exit(0);
  });

  // Force close after 10s fallback
  setTimeout(() => {
    logger.error('Graceful shutdown timed out. Forcing hard termination.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Catch structural exceptions
process.on('unhandledRejection', (reason, promise) => {
  logger.fatal({
    msg: 'FATAL: Unhandled Promise Rejection at source',
    promise,
    reason: reason instanceof Error ? reason.message : reason,
    stack: reason instanceof Error ? reason.stack : undefined
  });
  
  server.close(async () => {
    try {
      await prisma.$disconnect();
    } catch (err) {
      logger.error({ msg: 'Failed to disconnect DB on unhandled rejection', error: err.message });
    }
    process.exit(1);
  });
});

process.on('uncaughtException', (error) => {
  logger.fatal({
    msg: 'FATAL: Uncaught Synchronous Exception thrown',
    error: error.message,
    stack: error.stack
  });
  
  process.exit(1);
});
