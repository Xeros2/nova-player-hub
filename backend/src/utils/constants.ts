/**
 * Nova Player - Constants
 * Centralized configuration and constants
 */

// Device status enumeration
export const DEVICE_STATUS = {
  OPEN: 'OPEN',
  TRIAL: 'TRIAL',
  ACTIVE: 'ACTIVE',
  EXPIRED: 'EXPIRED',
  LIFETIME: 'LIFETIME',
} as const;

export type DeviceStatusType = typeof DEVICE_STATUS[keyof typeof DEVICE_STATUS];

// License types
export const LICENSE_TYPE = {
  LIFETIME: 'LIFETIME',
  YEARLY: 'YEARLY',
  MONTHLY: 'MONTHLY',
  TRIAL: 'TRIAL',
} as const;

export type LicenseTypeType = typeof LICENSE_TYPE[keyof typeof LICENSE_TYPE];

// License status
export const LICENSE_STATUS = {
  AVAILABLE: 'AVAILABLE',
  ACTIVATED: 'ACTIVATED',
  REVOKED: 'REVOKED',
  EXPIRED: 'EXPIRED',
} as const;

export type LicenseStatusType = typeof LICENSE_STATUS[keyof typeof LICENSE_STATUS];

// Admin roles
export const ADMIN_ROLE = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  BUSINESS_ADMIN: 'BUSINESS_ADMIN',
  SUPPORT: 'SUPPORT',
  TECH_ADMIN: 'TECH_ADMIN',
} as const;

export type AdminRoleType = typeof ADMIN_ROLE[keyof typeof ADMIN_ROLE];

// Admin types
export const ADMIN_TYPE = {
  TECH: 'TECH',
  BUSINESS: 'BUSINESS',
} as const;

export type AdminTypeType = typeof ADMIN_TYPE[keyof typeof ADMIN_TYPE];

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_ERROR: 500,
} as const;

// Error messages
export const ERROR_MESSAGES = {
  // Auth
  INVALID_CREDENTIALS: 'Invalid credentials',
  INVALID_TOKEN: 'Invalid or expired token',
  TOKEN_REQUIRED: 'Authentication token required',
  ACCESS_DENIED: 'Access denied',
  INSUFFICIENT_PERMISSIONS: 'Insufficient permissions',

  // Device
  DEVICE_NOT_FOUND: 'Device not found',
  DEVICE_EXISTS: 'Device already exists',
  DEVICE_BANNED: 'Device is banned',
  INVALID_PIN: 'Invalid PIN',
  TRIAL_ALREADY_USED: 'Trial period already used',

  // License
  LICENSE_NOT_FOUND: 'License not found',
  LICENSE_NOT_AVAILABLE: 'License is not available',
  LICENSE_ALREADY_ACTIVATED: 'License already activated',

  // Reseller
  RESELLER_NOT_FOUND: 'Reseller not found',
  RESELLER_EXISTS: 'Reseller already exists',
  RESELLER_BLOCKED: 'Reseller account is blocked',
  INSUFFICIENT_STOCK: 'Insufficient license stock',

  // Playlist
  PLAYLIST_NOT_FOUND: 'Playlist not found',

  // General
  VALIDATION_ERROR: 'Validation error',
  RATE_LIMIT_EXCEEDED: 'Too many requests, please try again later',
  INTERNAL_ERROR: 'Internal server error',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  DEVICE_REGISTERED: 'Device registered successfully',
  DEVICE_ACTIVATED: 'Device activated successfully',
  DEVICE_BANNED: 'Device banned successfully',
  DEVICE_UNBANNED: 'Device unbanned successfully',
  DEVICE_PROLONGED: 'Device prolonged successfully',
  TRIAL_STARTED: 'Trial period started successfully',
  LICENSE_CREATED: 'License created successfully',
  LICENSE_ACTIVATED: 'License activated successfully',
  LICENSE_REVOKED: 'License revoked successfully',
  RESELLER_CREATED: 'Reseller created successfully',
  PLAYLIST_ADDED: 'Playlist added successfully',
  PLAYLIST_DELETED: 'Playlist deleted successfully',
  LOGIN_SUCCESS: 'Login successful',
} as const;

// Activation durations (in days)
export const ACTIVATION_DURATIONS = {
  MONTHLY: 30,
  QUARTERLY: 90,
  SEMI_ANNUAL: 180,
  ANNUAL: 365,
} as const;

export default {
  DEVICE_STATUS,
  LICENSE_TYPE,
  LICENSE_STATUS,
  ADMIN_ROLE,
  ADMIN_TYPE,
  HTTP_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  ACTIVATION_DURATIONS,
};
