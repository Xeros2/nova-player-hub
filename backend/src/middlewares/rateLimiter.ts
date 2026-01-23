/**
 * Nova Player - Rate Limiter Middleware
 * Protection against brute force and abuse
 */

import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';
import { env } from '../config/env';
import { HTTP_STATUS, ERROR_MESSAGES } from '../utils/constants';

/**
 * Create a rate limiter with custom options
 */
export function createRateLimiter(options: {
  windowMs?: number;
  max?: number;
  message?: string;
  keyGenerator?: (req: { ip?: string }) => string;
}): RateLimitRequestHandler {
  return rateLimit({
    windowMs: options.windowMs || env.RATE_LIMIT_WINDOW_MS,
    max: options.max || env.RATE_LIMIT_MAX_REQUESTS,
    message: {
      success: false,
      error: {
        code: HTTP_STATUS.TOO_MANY_REQUESTS,
        message: options.message || ERROR_MESSAGES.RATE_LIMIT_EXCEEDED,
      },
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: options.keyGenerator || ((req) => req.ip || 'unknown'),
  });
}

/**
 * General API rate limiter
 * 100 requests per 15 minutes
 */
export const generalLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
});

/**
 * Login rate limiter
 * 5 attempts per 15 minutes
 */
export const loginLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: env.LOGIN_RATE_LIMIT_MAX,
  message: 'Too many login attempts, please try again later',
});

/**
 * Device registration rate limiter
 * 10 registrations per hour
 */
export const registrationLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: 'Too many device registrations, please try again later',
});

/**
 * Device status rate limiter
 * 60 requests per minute
 */
export const statusLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 60,
});

/**
 * Admin operations rate limiter
 * 1000 requests per 15 minutes
 */
export const adminLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,
});

/**
 * Business operations rate limiter
 * 500 requests per 15 minutes
 */
export const businessLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500,
});

export default {
  createRateLimiter,
  generalLimiter,
  loginLimiter,
  registrationLimiter,
  statusLimiter,
  adminLimiter,
  businessLimiter,
};
