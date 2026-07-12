import { PrismaClient } from '@prisma/client';
import { env } from '../config/env.js';
import { logger } from '../middlewares/logging.middleware.js';

let prisma;

try {
  console.log('Initializing Prisma Client with URL:', env.DATABASE_URL);
  if (env.NODE_ENV === 'production') {
    prisma = new PrismaClient();
  } else {
    if (!global.prisma) {
      global.prisma = new PrismaClient();
    }
    prisma = global.prisma;
  }
} catch (err) {
  // Catch "@prisma/client did not initialize yet" error when schema has no models (Phase 1 constraint)
  logger.warn('Prisma Client failed to initialize (this is expected in Phase 1 when no database models are defined yet). Exporting mock proxy client.');
  
  prisma = new Proxy({}, {
    get: (target, prop) => {
      if (prop === '$disconnect') {
        return async () => {
          logger.info('Database client mock disconnected cleanly.');
        };
      }
      throw new Error(`Prisma Client is not generated yet. Please define models in schema.prisma and run "npx prisma generate" first.`);
    }
  });
}

export default prisma;
