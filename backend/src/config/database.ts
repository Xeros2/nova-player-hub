/**
 * Nova Player - Database Configuration
 * Prisma Client singleton for connection pooling
 */

import { PrismaClient } from '@prisma/client';
import { env } from './env';
import logger from '../utils/logger';

// Prisma client singleton
let prisma: PrismaClient;

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

// Use singleton pattern to prevent multiple instances in development
if (env.NODE_ENV === 'production') {
  prisma = new PrismaClient({
    log: env.LOG_LEVEL === 'debug' ? ['query', 'info', 'warn', 'error'] : ['error'],
  });
} else {
  if (!global.__prisma) {
    global.__prisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
    });
  }
  prisma = global.__prisma;
}

/**
 * Test database connection
 */
export async function testConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    logger.info('Database connection established successfully');
    return true;
  } catch (error) {
    logger.error('Failed to connect to database:', error);
    return false;
  }
}

/**
 * Disconnect from database
 */
export async function disconnect(): Promise<void> {
  await prisma.$disconnect();
  logger.info('Database connection closed');
}

/**
 * Initialize database schemas
 * Creates the required PostgreSQL schemas if they don't exist
 */
export async function initializeSchemas(): Promise<void> {
  try {
    await prisma.$executeRaw`CREATE SCHEMA IF NOT EXISTS core`;
    await prisma.$executeRaw`CREATE SCHEMA IF NOT EXISTS billing`;
    await prisma.$executeRaw`CREATE SCHEMA IF NOT EXISTS resellers`;
    logger.info('Database schemas initialized');
  } catch (error) {
    logger.error('Failed to initialize database schemas:', error);
    throw error;
  }
}

export { prisma };
export default prisma;
