/**
 * Nova Player - Environment Configuration
 * Typed environment variables with validation
 */

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface EnvConfig {
  // Server
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  HOST: string;

  // Database
  DATABASE_URL: string;

  // JWT Secrets
  ADMIN_JWT_SECRET: string;
  BUSINESS_JWT_SECRET: string;
  DEVICE_JWT_SECRET: string;

  // JWT Expiration
  ADMIN_JWT_EXPIRES_IN: string;
  BUSINESS_JWT_EXPIRES_IN: string;
  DEVICE_JWT_EXPIRES_IN: string;

  // CORS
  CORS_ORIGIN: string[];

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX_REQUESTS: number;
  LOGIN_RATE_LIMIT_MAX: number;

  // Trial
  TRIAL_DURATION_DAYS: number;

  // Bcrypt
  BCRYPT_SALT_ROUNDS: number;

  // Logging
  LOG_LEVEL: string;
  LOG_FORMAT: string;
}

function parseEnv(): EnvConfig {
  const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
  
  return {
    // Server
    NODE_ENV: (process.env.NODE_ENV as EnvConfig['NODE_ENV']) || 'development',
    PORT: parseInt(process.env.PORT || '3000', 10),
    HOST: process.env.HOST || '0.0.0.0',

    // Database
    DATABASE_URL: process.env.DATABASE_URL || '',

    // JWT Secrets
    ADMIN_JWT_SECRET: process.env.ADMIN_JWT_SECRET || 'default-admin-secret-change-me',
    BUSINESS_JWT_SECRET: process.env.BUSINESS_JWT_SECRET || 'default-business-secret-change-me',
    DEVICE_JWT_SECRET: process.env.DEVICE_JWT_SECRET || 'default-device-secret-change-me',

    // JWT Expiration
    ADMIN_JWT_EXPIRES_IN: process.env.ADMIN_JWT_EXPIRES_IN || '7d',
    BUSINESS_JWT_EXPIRES_IN: process.env.BUSINESS_JWT_EXPIRES_IN || '24h',
    DEVICE_JWT_EXPIRES_IN: process.env.DEVICE_JWT_EXPIRES_IN || '30d',

    // CORS
    CORS_ORIGIN: corsOrigin.split(',').map(origin => origin.trim()),

    // Rate Limiting
    RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
    LOGIN_RATE_LIMIT_MAX: parseInt(process.env.LOGIN_RATE_LIMIT_MAX || '5', 10),

    // Trial
    TRIAL_DURATION_DAYS: parseInt(process.env.TRIAL_DURATION_DAYS || '30', 10),

    // Bcrypt
    BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10),

    // Logging
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    LOG_FORMAT: process.env.LOG_FORMAT || 'json',
  };
}

function validateEnv(config: EnvConfig): void {
  const errors: string[] = [];

  if (!config.DATABASE_URL) {
    errors.push('DATABASE_URL is required');
  }

  if (config.NODE_ENV === 'production') {
    if (config.ADMIN_JWT_SECRET.includes('default') || config.ADMIN_JWT_SECRET.includes('change-me')) {
      errors.push('ADMIN_JWT_SECRET must be changed in production');
    }
    if (config.BUSINESS_JWT_SECRET.includes('default') || config.BUSINESS_JWT_SECRET.includes('change-me')) {
      errors.push('BUSINESS_JWT_SECRET must be changed in production');
    }
    if (config.DEVICE_JWT_SECRET.includes('default') || config.DEVICE_JWT_SECRET.includes('change-me')) {
      errors.push('DEVICE_JWT_SECRET must be changed in production');
    }
  }

  if (errors.length > 0) {
    throw new Error(`Environment validation failed:\n${errors.join('\n')}`);
  }
}

export const env = parseEnv();

// Validate in production
if (env.NODE_ENV === 'production') {
  validateEnv(env);
}

export default env;
