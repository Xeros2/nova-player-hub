/**
 * Nova Player - Error Handler Middleware
 * Centralized error handling
 */

const { HTTP_STATUS, ERROR_MESSAGES } = require('../utils/constants');
const logger = require('../utils/logger');

/**
 * Custom API Error class
 */
class ApiError extends Error {
  constructor(message, statusCode = HTTP_STATUS.INTERNAL_ERROR, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Not Found error handler (404)
 */
const notFoundHandler = (req, res, next) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    error: 'Endpoint not found',
    path: req.originalUrl
  });
};

/**
 * Global error handler
 */
const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.logError(err, {
    path: req.path,
    method: req.method,
    ip: req.ip
  });
  
  // Determine status code
  let statusCode = err.statusCode || HTTP_STATUS.INTERNAL_ERROR;
  let message = err.message || ERROR_MESSAGES.INTERNAL_ERROR;
  let details = err.details || null;
  
  // Handle specific error types
  if (err.name === 'SequelizeValidationError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = ERROR_MESSAGES.VALIDATION_ERROR;
    details = err.errors.map(e => ({
      field: e.path,
      message: e.message
    }));
  }
  
  if (err.name === 'SequelizeUniqueConstraintError') {
    statusCode = HTTP_STATUS.CONFLICT;
    message = 'Resource already exists';
    details = err.errors.map(e => ({
      field: e.path,
      message: e.message
    }));
  }
  
  if (err.name === 'JsonWebTokenError') {
    statusCode = HTTP_STATUS.UNAUTHORIZED;
    message = ERROR_MESSAGES.UNAUTHORIZED;
  }
  
  if (err.name === 'TokenExpiredError') {
    statusCode = HTTP_STATUS.UNAUTHORIZED;
    message = 'Token has expired';
  }
  
  // Map common error messages to status codes
  const errorStatusMap = {
    [ERROR_MESSAGES.DEVICE_NOT_FOUND]: HTTP_STATUS.NOT_FOUND,
    [ERROR_MESSAGES.PLAYLIST_NOT_FOUND]: HTTP_STATUS.NOT_FOUND,
    [ERROR_MESSAGES.RESELLER_NOT_FOUND]: HTTP_STATUS.NOT_FOUND,
    [ERROR_MESSAGES.DEVICE_EXISTS]: HTTP_STATUS.CONFLICT,
    [ERROR_MESSAGES.RESELLER_EXISTS]: HTTP_STATUS.CONFLICT,
    [ERROR_MESSAGES.INVALID_CREDENTIALS]: HTTP_STATUS.UNAUTHORIZED,
    [ERROR_MESSAGES.INVALID_PIN]: HTTP_STATUS.UNAUTHORIZED,
    [ERROR_MESSAGES.UNAUTHORIZED]: HTTP_STATUS.UNAUTHORIZED,
    [ERROR_MESSAGES.FORBIDDEN]: HTTP_STATUS.FORBIDDEN,
    [ERROR_MESSAGES.TRIAL_ALREADY_USED]: HTTP_STATUS.BAD_REQUEST,
    [ERROR_MESSAGES.INSUFFICIENT_CREDITS]: HTTP_STATUS.BAD_REQUEST
  };
  
  if (errorStatusMap[message]) {
    statusCode = errorStatusMap[message];
  }
  
  // Don't expose internal errors in production
  if (process.env.NODE_ENV === 'production' && statusCode === HTTP_STATUS.INTERNAL_ERROR) {
    message = ERROR_MESSAGES.INTERNAL_ERROR;
    details = null;
  }
  
  // Send response
  const response = {
    success: false,
    error: message
  };
  
  if (details) {
    response.details = details;
  }
  
  // Add stack trace in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }
  
  res.status(statusCode).json(response);
};

/**
 * Async handler wrapper to catch errors
 * @param {function} fn - Async function
 * @returns {function} - Express middleware
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  ApiError,
  notFoundHandler,
  errorHandler,
  asyncHandler
};
