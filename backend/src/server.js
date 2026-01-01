/**
 * Nova Player - Server Entry Point
 * Initializes database and starts the HTTP server
 */

require('dotenv').config();

const app = require('./app');
const { testConnection, syncDatabase } = require('./models');
const logger = require('./utils/logger');

// Server configuration
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

/**
 * Initialize the server
 */
const startServer = async () => {
  try {
    logger.info('Starting Nova Player API...');
    
    // Test database connection
    logger.info('Connecting to database...');
    const connected = await testConnection();
    
    if (!connected) {
      throw new Error('Failed to connect to database');
    }
    
    // Sync database models
    logger.info('Synchronizing database models...');
    const synced = await syncDatabase();
    
    if (!synced) {
      throw new Error('Failed to synchronize database');
    }
    
    // Start HTTP server
    const server = app.listen(PORT, HOST, () => {
      logger.info(`Nova Player API running on http://${HOST}:${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info('Press Ctrl+C to stop');
    });
    
    // Graceful shutdown
    const shutdown = async (signal) => {
      logger.info(`${signal} received. Shutting down gracefully...`);
      
      server.close(async () => {
        logger.info('HTTP server closed');
        
        // Close database connection
        const { sequelize } = require('./models');
        await sequelize.close();
        logger.info('Database connection closed');
        
        process.exit(0);
      });
      
      // Force exit after 30 seconds
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 30000);
    };
    
    // Handle shutdown signals
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
    
    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      shutdown('UNCAUGHT_EXCEPTION');
    });
    
    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    });
    
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();
