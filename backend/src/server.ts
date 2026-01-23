/**
 * Nova Player - Server Entry Point
 */
import app from './app';
import { testConnection, initializeSchemas } from './config/database';
import { env } from './config/env';
import logger from './utils/logger';

async function startServer() {
  try {
    logger.info('Starting Nova Player API...');
    
    const connected = await testConnection();
    if (!connected) throw new Error('Database connection failed');
    
    await initializeSchemas();
    
    const server = app.listen(env.PORT, env.HOST, () => {
      logger.info(`Nova Player API running on http://${env.HOST}:${env.PORT}`);
      logger.info(`Environment: ${env.NODE_ENV}`);
    });
    
    const shutdown = async (signal: string) => {
      logger.info(`${signal} received. Shutting down...`);
      server.close(async () => {
        const { prisma } = await import('./config/database');
        await prisma.$disconnect();
        process.exit(0);
      });
    };
    
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
