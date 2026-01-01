/**
 * Nova Player - Constants
 * Centralized configuration and constants
 */

// Device status enumeration
const DEVICE_STATUS = {
  OPEN: 'OPEN',           // Device registered but not activated
  TRIAL: 'TRIAL',         // Device in trial period
  EXPIRED: 'EXPIRED',     // Trial or activation expired
  ACTIVE: 'ACTIVE',       // Device actively licensed
  LIFETIME: 'LIFETIME'    // Device with lifetime activation
};

// Trial configuration
const TRIAL_CONFIG = {
  DURATION_DAYS: parseInt(process.env.TRIAL_DURATION_DAYS) || 30,
  MAX_TRIALS_PER_DEVICE: 1
};

// JWT configuration
const JWT_CONFIG = {
  SECRET: process.env.JWT_SECRET || 'default-secret-change-me',
  ADMIN_SECRET: process.env.ADMIN_JWT_SECRET || 'admin-secret-change-me',
  EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  ADMIN_EXPIRES_IN: process.env.ADMIN_JWT_EXPIRES_IN || '7d',
  RESELLER_EXPIRES_IN: process.env.RESELLER_JWT_EXPIRES_IN || '24h'
};

// Bcrypt configuration
const BCRYPT_CONFIG = {
  SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12
};

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  LOGIN_MAX: parseInt(process.env.LOGIN_RATE_LIMIT_MAX) || 5,
  STATUS_MAX: 100,
  ADMIN_MAX: 1000
};

// HTTP status codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_ERROR: 500
};

// Error messages
const ERROR_MESSAGES = {
  DEVICE_NOT_FOUND: 'Device not found',
  DEVICE_EXISTS: 'Device already exists',
  INVALID_CREDENTIALS: 'Invalid credentials',
  INVALID_PIN: 'Invalid PIN',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  TRIAL_ALREADY_USED: 'Trial period already used',
  TRIAL_NOT_STARTED: 'Trial not started',
  INSUFFICIENT_CREDITS: 'Insufficient credits',
  PLAYLIST_NOT_FOUND: 'Playlist not found',
  RESELLER_NOT_FOUND: 'Reseller not found',
  RESELLER_EXISTS: 'Reseller already exists',
  VALIDATION_ERROR: 'Validation error',
  RATE_LIMIT_EXCEEDED: 'Too many requests, please try again later',
  INTERNAL_ERROR: 'Internal server error'
};

// Success messages
const SUCCESS_MESSAGES = {
  DEVICE_REGISTERED: 'Device registered successfully',
  DEVICE_ACTIVATED: 'Device activated successfully',
  TRIAL_STARTED: 'Trial period started successfully',
  PLAYLIST_ADDED: 'Playlist added successfully',
  PLAYLIST_DELETED: 'Playlist deleted successfully',
  RESELLER_CREATED: 'Reseller created successfully',
  CREDITS_ADDED: 'Credits added successfully',
  LOGIN_SUCCESS: 'Login successful'
};

// Activation durations (in days)
const ACTIVATION_DURATIONS = {
  MONTHLY: 30,
  QUARTERLY: 90,
  SEMI_ANNUAL: 180,
  ANNUAL: 365
};

module.exports = {
  DEVICE_STATUS,
  TRIAL_CONFIG,
  JWT_CONFIG,
  BCRYPT_CONFIG,
  RATE_LIMIT_CONFIG,
  HTTP_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  ACTIVATION_DURATIONS
};
