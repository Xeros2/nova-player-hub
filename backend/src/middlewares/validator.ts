/**
 * Nova Player - Validation Middleware
 * Request validation using Joi
 */

import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ApiError } from './errorHandler';
import { ERROR_MESSAGES, HTTP_STATUS } from '../utils/constants';

// ============================================================
// VALIDATION SCHEMAS
// ============================================================

// Device schemas
const deviceRegister = Joi.object({
  device_code: Joi.string().min(4).max(50).required(),
  pin: Joi.string().length(6).pattern(/^\d+$/).required(),
  platform: Joi.string().max(50).optional(),
  player_version: Joi.string().max(20).optional(),
});

const deviceAuth = Joi.object({
  device_code: Joi.string().min(4).max(50).required(),
  pin: Joi.string().length(6).pattern(/^\d+$/).required(),
});

const deviceStatus = Joi.object({
  device_code: Joi.string().min(4).max(50).required(),
});

// Playlist schemas
const playlistAdd = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  url: Joi.string().uri().max(2048).required(),
});

const playlistUpdate = Joi.object({
  name: Joi.string().min(1).max(100).optional(),
  url: Joi.string().uri().max(2048).optional(),
}).or('name', 'url');

// Admin schemas
const adminLogin = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const adminBan = Joi.object({
  reason: Joi.string().max(500).optional(),
});

const adminProlong = Joi.object({
  days: Joi.number().integer().min(1).max(3650).required(),
});

// Business schemas
const businessLogin = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const licenseCreate = Joi.object({
  quantity: Joi.number().integer().min(1).max(1000).default(1),
  type: Joi.string().valid('LIFETIME', 'YEARLY', 'MONTHLY').default('LIFETIME'),
  origin: Joi.string().valid('DIRECT_SALE', 'RESELLER', 'PROMOTIONAL').default('DIRECT_SALE'),
});

const licenseActivate = Joi.object({
  license_key: Joi.string().required(),
  device_code: Joi.string().min(4).max(50).required(),
});

const resellerCreate = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  company_name: Joi.string().max(255).optional(),
  contact_name: Joi.string().max(255).optional(),
  phone: Joi.string().max(20).optional(),
  license_quota: Joi.number().integer().min(0).default(0),
});

const resellerAssignLicenses = Joi.object({
  quantity: Joi.number().integer().min(1).max(1000).required(),
});

// Query schemas
const paginationQuery = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});

const deviceFilterQuery = paginationQuery.keys({
  status: Joi.string().valid('OPEN', 'TRIAL', 'ACTIVE', 'EXPIRED', 'LIFETIME').optional(),
  reseller_id: Joi.string().uuid().optional(),
  is_banned: Joi.boolean().optional(),
});

const licenseFilterQuery = paginationQuery.keys({
  status: Joi.string().valid('AVAILABLE', 'ACTIVATED', 'REVOKED', 'EXPIRED').optional(),
  type: Joi.string().valid('LIFETIME', 'YEARLY', 'MONTHLY', 'TRIAL').optional(),
  origin: Joi.string().valid('DIRECT_SALE', 'RESELLER', 'PROMOTIONAL').optional(),
});

// Schema registry
const schemas: Record<string, Joi.ObjectSchema> = {
  deviceRegister,
  deviceAuth,
  deviceStatus,
  playlistAdd,
  playlistUpdate,
  adminLogin,
  adminBan,
  adminProlong,
  businessLogin,
  licenseCreate,
  licenseActivate,
  resellerCreate,
  resellerAssignLicenses,
  paginationQuery,
  deviceFilterQuery,
  licenseFilterQuery,
};

// ============================================================
// VALIDATION MIDDLEWARE
// ============================================================

/**
 * Validate request body
 */
export function validateBody(schemaName: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const schema = schemas[schemaName];

    if (!schema) {
      next(new ApiError(`Validation schema '${schemaName}' not found`, HTTP_STATUS.INTERNAL_ERROR));
      return;
    }

    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const details = error.details.map(d => ({
        field: d.path.join('.'),
        message: d.message,
      }));

      next(new ApiError(ERROR_MESSAGES.VALIDATION_ERROR, HTTP_STATUS.BAD_REQUEST, details));
      return;
    }

    req.body = value;
    next();
  };
}

/**
 * Validate request query
 */
export function validateQuery(schemaName: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const schema = schemas[schemaName];

    if (!schema) {
      next(new ApiError(`Validation schema '${schemaName}' not found`, HTTP_STATUS.INTERNAL_ERROR));
      return;
    }

    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const details = error.details.map(d => ({
        field: d.path.join('.'),
        message: d.message,
      }));

      next(new ApiError(ERROR_MESSAGES.VALIDATION_ERROR, HTTP_STATUS.BAD_REQUEST, details));
      return;
    }

    req.query = value;
    next();
  };
}

/**
 * Validate request params
 */
export function validateParams(schemaName: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const schema = schemas[schemaName];

    if (!schema) {
      next(new ApiError(`Validation schema '${schemaName}' not found`, HTTP_STATUS.INTERNAL_ERROR));
      return;
    }

    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const details = error.details.map(d => ({
        field: d.path.join('.'),
        message: d.message,
      }));

      next(new ApiError(ERROR_MESSAGES.VALIDATION_ERROR, HTTP_STATUS.BAD_REQUEST, details));
      return;
    }

    req.params = value;
    next();
  };
}

// UUID param schema
const uuidParam = Joi.object({
  id: Joi.string().uuid().required(),
});

schemas.uuidParam = uuidParam;

export { schemas };

export default {
  validateBody,
  validateQuery,
  validateParams,
  schemas,
};
