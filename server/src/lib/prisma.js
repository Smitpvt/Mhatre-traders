import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { env } from '../config/env.js';
import { logger } from '../middlewares/logging.middleware.js';

const { Pool } = pg;

let prisma;

try {
  if (!globalThis.prisma) {
    logger.info('Initializing single global Prisma Client instance with Driver Adapter...');
    
    const connectionString = env.DATABASE_URL;
    const url = new URL(connectionString);
    const connectionLimit = url.searchParams.get('connection_limit');
    
    // Optimize for Hostinger: default to 4 connections maximum to respect NPROC limits
    const maxConnections = connectionLimit ? parseInt(connectionLimit, 10) : 4;

    const pool = new Pool({
      connectionString,
      max: maxConnections,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 15000, // Allow requests to wait in queue under high concurrent load
    });

    pool.on('error', (err) => {
      logger.error({ error: err.message }, 'Unexpected error on idle database connection client');
    });

    const adapter = new PrismaPg(pool);
    globalThis.prisma = new PrismaClient({ adapter });
    globalThis.prismaPool = pool;
  }
  
  prisma = globalThis.prisma;
} catch (err) {
  // Catch "@prisma/client did not initialize yet" error when schema has no models (Phase 1 constraint)
  logger.warn({ error: err.message }, 'Prisma Client failed to initialize. Exporting mock proxy client.');
  
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
