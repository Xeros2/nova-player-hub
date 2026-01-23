/**
 * Nova Player - Logger
 * Centralized logging with Winston
 */

import winston from 'winston';
import path from 'path';
import { env } from '../config/env';

// Define log format based on environment
const getFormat = () => {
  if (env.LOG_FORMAT === 'json') {
    return winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.errors({ stack: true }),
      winston.format.json()
    );
  }

  return winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.colorize(),
    winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
      let log = `${timestamp} [${level}]: ${message}`;
      
      if (Object.keys(meta).length > 0) {
        log += ` ${JSON.stringify(meta)}`;
      }
      
      if (stack) {
        log += `\n${stack}`;
      }
      
      return log;
    })
  );
};

// Define transports
const transports: winston.transport[] = [
  new winston.transports.Console({
    format: getFormat(),
  }),
];

// Add file transports in production
if (env.NODE_ENV === 'production') {
  const logsDir = path.join(process.cwd(), 'logs');
  
  transports.push(
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  );
}

// Create logger instance
const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  format: getFormat(),
  transports,
  exitOnError: false,
});

// Helper methods for structured logging
export const logRequest = (req: { method: string; path: string; ip?: string }, message = 'Incoming request'): void => {
  logger.info(message, {
    method: req.method,
    path: req.path,
    ip: req.ip,
  });
};

export const logError = (error: Error, context: Record<string, unknown> = {}): void => {
  logger.error(error.message, {
    ...context,
    stack: error.stack,
  });
};

export const logAuth = (action: string, userId: string, success = true): void => {
  const level = success ? 'info' : 'warn';
  logger[level](`Auth: ${action}`, { userId, success });
};

export const logDevice = (action: string, deviceCode: string, details: Record<string, unknown> = {}): void => {
  logger.info(`Device: ${action}`, { deviceCode, ...details });
};

export const logBusiness = (action: string, details: Record<string, unknown> = {}): void => {
  logger.info(`Business: ${action}`, details);
};

export default logger;
