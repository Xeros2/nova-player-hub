/**
 * Nova Player - Input Validator Middleware
 * Request validation using Joi
 */

const Joi = require('joi');
const { HTTP_STATUS, ERROR_MESSAGES } = require('../utils/constants');

/**
 * Validation schemas
 */
const schemas = {
  // Device schemas
  deviceRegister: Joi.object({
    device_code: Joi.string().min(4).max(50).required()
      .messages({
        'string.min': 'Device code must be at least 4 characters',
        'string.max': 'Device code must be at most 50 characters',
        'any.required': 'Device code is required'
      }),
    pin: Joi.string().min(4).max(20).required()
      .messages({
        'string.min': 'PIN must be at least 4 characters',
        'string.max': 'PIN must be at most 20 characters',
        'any.required': 'PIN is required'
      })
  }),
  
  deviceAuth: Joi.object({
    device_code: Joi.string().required(),
    pin: Joi.string().required()
  }),
  
  deviceStatus: Joi.object({
    device_code: Joi.string().required()
  }),
  
  deviceActivate: Joi.object({
    device_code: Joi.string().required(),
    days: Joi.number().integer().min(1).max(3650),
    lifetime: Joi.boolean()
  }).or('days', 'lifetime'),
  
  // Playlist schemas
  playlistAdd: Joi.object({
    name: Joi.string().min(1).max(100).required()
      .messages({
        'string.min': 'Playlist name is required',
        'string.max': 'Playlist name must be at most 100 characters'
      }),
    url: Joi.string().uri().max(2048).required()
      .messages({
        'string.uri': 'Please provide a valid URL',
        'any.required': 'Playlist URL is required'
      })
  }),
  
  playlistUpdate: Joi.object({
    name: Joi.string().min(1).max(100),
    url: Joi.string().uri().max(2048)
  }).min(1),
  
  // Reseller schemas
  resellerLogin: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),
  
  resellerCreate: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(128).required()
      .messages({
        'string.min': 'Password must be at least 8 characters'
      }),
    credits: Joi.number().integer().min(0).default(0)
  }),
  
  resellerCredits: Joi.object({
    reseller_id: Joi.string().uuid().required(),
    amount: Joi.number().integer().min(1).required()
  }),
  
  resellerActivate: Joi.object({
    device_code: Joi.string().required(),
    days: Joi.number().integer().min(1).max(3650).required()
  }),
  
  // Admin schemas
  adminLogin: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
  }),
  
  batchOperation: Joi.object({
    device_codes: Joi.array().items(Joi.string()).min(1).max(100).required()
  }),
  
  batchActivate: Joi.object({
    device_codes: Joi.array().items(Joi.string()).min(1).max(100).required(),
    days: Joi.number().integer().min(1).max(3650).required()
  }),
  
  // Pagination
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(50),
    status: Joi.string().valid('OPEN', 'TRIAL', 'EXPIRED', 'ACTIVE', 'LIFETIME'),
    reseller_id: Joi.string().uuid()
  }),
  
  // UUID param
  uuidParam: Joi.object({
    id: Joi.string().uuid().required()
  })
};

/**
 * Validate request body against schema
 * @param {string} schemaName - Name of schema to use
 * @returns {function} - Express middleware
 */
const validateBody = (schemaName) => {
  return (req, res, next) => {
    const schema = schemas[schemaName];
    
    if (!schema) {
      return next(new Error(`Validation schema '${schemaName}' not found`));
    }
    
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: ERROR_MESSAGES.VALIDATION_ERROR,
        details: errors
      });
    }
    
    // Replace body with validated value
    req.body = value;
    next();
  };
};

/**
 * Validate request query against schema
 * @param {string} schemaName - Name of schema to use
 * @returns {function} - Express middleware
 */
const validateQuery = (schemaName) => {
  return (req, res, next) => {
    const schema = schemas[schemaName];
    
    if (!schema) {
      return next(new Error(`Validation schema '${schemaName}' not found`));
    }
    
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true
    });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: ERROR_MESSAGES.VALIDATION_ERROR,
        details: errors
      });
    }
    
    req.query = value;
    next();
  };
};

/**
 * Validate request params against schema
 * @param {string} schemaName - Name of schema to use
 * @returns {function} - Express middleware
 */
const validateParams = (schemaName) => {
  return (req, res, next) => {
    const schema = schemas[schemaName];
    
    if (!schema) {
      return next(new Error(`Validation schema '${schemaName}' not found`));
    }
    
    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true
    });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: ERROR_MESSAGES.VALIDATION_ERROR,
        details: errors
      });
    }
    
    req.params = value;
    next();
  };
};

module.exports = {
  schemas,
  validateBody,
  validateQuery,
  validateParams
};
