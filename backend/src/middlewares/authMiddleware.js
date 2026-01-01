/**
 * Nova Player - Auth Middleware
 * JWT verification and role-based access control
 */

const authService = require('../services/authService');
const { HTTP_STATUS, ERROR_MESSAGES } = require('../utils/constants');
const logger = require('../utils/logger');

/**
 * Middleware to verify device token
 */
const authenticateDevice = (req, res, next) => {
  try {
    const token = authService.extractToken(req.headers.authorization);
    
    if (!token) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: ERROR_MESSAGES.UNAUTHORIZED
      });
    }
    
    const decoded = authService.verifyToken(token);
    
    if (!decoded || decoded.type !== 'device') {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: ERROR_MESSAGES.UNAUTHORIZED
      });
    }
    
    // Attach device info to request
    req.device = {
      id: decoded.deviceId,
      deviceCode: decoded.deviceCode
    };
    
    next();
  } catch (error) {
    logger.logError(error, { context: 'Device authentication' });
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      error: ERROR_MESSAGES.UNAUTHORIZED
    });
  }
};

/**
 * Middleware to verify reseller token
 */
const authenticateReseller = (req, res, next) => {
  try {
    const token = authService.extractToken(req.headers.authorization);
    
    if (!token) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: ERROR_MESSAGES.UNAUTHORIZED
      });
    }
    
    const decoded = authService.verifyToken(token);
    
    if (!decoded || decoded.type !== 'reseller') {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: ERROR_MESSAGES.UNAUTHORIZED
      });
    }
    
    // Attach reseller info to request
    req.reseller = {
      id: decoded.resellerId,
      email: decoded.email
    };
    
    next();
  } catch (error) {
    logger.logError(error, { context: 'Reseller authentication' });
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      error: ERROR_MESSAGES.UNAUTHORIZED
    });
  }
};

/**
 * Middleware to verify admin token
 */
const authenticateAdmin = (req, res, next) => {
  try {
    const token = authService.extractToken(req.headers.authorization);
    
    if (!token) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: ERROR_MESSAGES.UNAUTHORIZED
      });
    }
    
    // Use admin secret for verification
    const decoded = authService.verifyToken(token, true);
    
    if (!decoded || decoded.type !== 'admin') {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        error: ERROR_MESSAGES.FORBIDDEN
      });
    }
    
    // Attach admin info to request
    req.admin = {
      id: decoded.adminId,
      role: decoded.role
    };
    
    next();
  } catch (error) {
    logger.logError(error, { context: 'Admin authentication' });
    return res.status(HTTP_STATUS.FORBIDDEN).json({
      success: false,
      error: ERROR_MESSAGES.FORBIDDEN
    });
  }
};

/**
 * Optional authentication - doesn't fail if no token
 */
const optionalAuth = (req, res, next) => {
  try {
    const token = authService.extractToken(req.headers.authorization);
    
    if (token) {
      const decoded = authService.verifyToken(token);
      if (decoded) {
        req.auth = decoded;
      }
    }
    
    next();
  } catch (error) {
    // Ignore auth errors for optional auth
    next();
  }
};

module.exports = {
  authenticateDevice,
  authenticateReseller,
  authenticateAdmin,
  optionalAuth
};
