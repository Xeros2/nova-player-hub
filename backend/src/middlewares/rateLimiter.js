/**
 * Nova Player - Rate Limiter Middleware
 * Protection against abuse and brute force attacks
 */

const rateLimit = require('express-rate-limit');
const { RATE_LIMIT_CONFIG, HTTP_STATUS, ERROR_MESSAGES } = require('../utils/constants');

/**
 * Create rate limiter with custom configuration
 * @param {object} options - Rate limit options
 * @returns {function} - Express middleware
 */
const createRateLimiter = (options = {}) => {
  return rateLimit({
    windowMs: options.windowMs || RATE_LIMIT_CONFIG.WINDOW_MS,
    max: options.max || RATE_LIMIT_CONFIG.MAX_REQUESTS,
    message: {
      success: false,
      error: ERROR_MESSAGES.RATE_LIMIT_EXCEEDED,
      retryAfter: Math.ceil((options.windowMs || RATE_LIMIT_CONFIG.WINDOW_MS) / 1000)
    },
    standardHeaders: true,
    legacyHeaders: false,
    // Skip rate limiting in test environment
    skip: () => process.env.NODE_ENV === 'test',
    // Key generator - use IP address
    keyGenerator: (req) => {
      return req.ip || req.headers['x-forwarded-for'] || 'unknown';
    }
  });
};

/**
 * General API rate limiter
 * 100 requests per 15 minutes
 */
const generalLimiter = createRateLimiter({
  windowMs: RATE_LIMIT_CONFIG.WINDOW_MS,
  max: RATE_LIMIT_CONFIG.MAX_REQUESTS
});

/**
 * Device status endpoint rate limiter
 * 100 requests per 15 minutes per IP
 */
const statusLimiter = createRateLimiter({
  windowMs: RATE_LIMIT_CONFIG.WINDOW_MS,
  max: RATE_LIMIT_CONFIG.STATUS_MAX
});

/**
 * Login rate limiter (reseller/admin)
 * 5 attempts per 15 minutes per IP
 */
const loginLimiter = createRateLimiter({
  windowMs: RATE_LIMIT_CONFIG.WINDOW_MS,
  max: RATE_LIMIT_CONFIG.LOGIN_MAX,
  message: {
    success: false,
    error: 'Too many login attempts. Please try again in 15 minutes.',
    retryAfter: Math.ceil(RATE_LIMIT_CONFIG.WINDOW_MS / 1000)
  }
});

/**
 * Admin endpoints rate limiter
 * 1000 requests per 15 minutes
 */
const adminLimiter = createRateLimiter({
  windowMs: RATE_LIMIT_CONFIG.WINDOW_MS,
  max: RATE_LIMIT_CONFIG.ADMIN_MAX
});

/**
 * Registration rate limiter
 * 10 registrations per hour per IP
 */
const registrationLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: {
    success: false,
    error: 'Too many device registrations. Please try again later.',
    retryAfter: 3600
  }
});

/**
 * Trial start rate limiter
 * 3 trial starts per hour per IP
 */
const trialLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: {
    success: false,
    error: 'Too many trial requests. Please try again later.',
    retryAfter: 3600
  }
});

module.exports = {
  createRateLimiter,
  generalLimiter,
  statusLimiter,
  loginLimiter,
  adminLimiter,
  registrationLimiter,
  trialLimiter
};
