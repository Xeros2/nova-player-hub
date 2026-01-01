/**
 * Nova Player - Auth Service
 * Handles authentication, JWT, and password hashing
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { JWT_CONFIG, BCRYPT_CONFIG } = require('../utils/constants');
const logger = require('../utils/logger');

/**
 * Hash a password or PIN using bcrypt
 * @param {string} plainText - Plain text to hash
 * @returns {Promise<string>} - Hashed string
 */
const hashPassword = async (plainText) => {
  try {
    const salt = await bcrypt.genSalt(BCRYPT_CONFIG.SALT_ROUNDS);
    return await bcrypt.hash(plainText, salt);
  } catch (error) {
    logger.error('Error hashing password:', error);
    throw error;
  }
};

/**
 * Compare plain text with hashed value
 * @param {string} plainText - Plain text to compare
 * @param {string} hash - Hashed value
 * @returns {Promise<boolean>} - True if match
 */
const comparePassword = async (plainText, hash) => {
  try {
    return await bcrypt.compare(plainText, hash);
  } catch (error) {
    logger.error('Error comparing password:', error);
    return false;
  }
};

/**
 * Generate JWT token for device
 * @param {object} device - Device object
 * @returns {string} - JWT token
 */
const generateDeviceToken = (device) => {
  const payload = {
    type: 'device',
    deviceId: device.id,
    deviceCode: device.device_code
  };
  
  return jwt.sign(payload, JWT_CONFIG.SECRET, {
    expiresIn: JWT_CONFIG.EXPIRES_IN
  });
};

/**
 * Generate JWT token for reseller
 * @param {object} reseller - Reseller object
 * @returns {string} - JWT token
 */
const generateResellerToken = (reseller) => {
  const payload = {
    type: 'reseller',
    resellerId: reseller.id,
    email: reseller.email
  };
  
  return jwt.sign(payload, JWT_CONFIG.SECRET, {
    expiresIn: JWT_CONFIG.RESELLER_EXPIRES_IN
  });
};

/**
 * Generate JWT token for admin
 * @param {object} admin - Admin object
 * @returns {string} - JWT token
 */
const generateAdminToken = (admin) => {
  const payload = {
    type: 'admin',
    adminId: admin.id,
    role: 'admin'
  };
  
  return jwt.sign(payload, JWT_CONFIG.ADMIN_SECRET, {
    expiresIn: JWT_CONFIG.ADMIN_EXPIRES_IN
  });
};

/**
 * Verify and decode JWT token
 * @param {string} token - JWT token
 * @param {boolean} isAdmin - Whether to use admin secret
 * @returns {object|null} - Decoded payload or null
 */
const verifyToken = (token, isAdmin = false) => {
  try {
    const secret = isAdmin ? JWT_CONFIG.ADMIN_SECRET : JWT_CONFIG.SECRET;
    return jwt.verify(token, secret);
  } catch (error) {
    logger.logError(error, { context: 'Token verification failed' });
    return null;
  }
};

/**
 * Extract token from authorization header
 * @param {string} authHeader - Authorization header value
 * @returns {string|null} - Token or null
 */
const extractToken = (authHeader) => {
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }
  
  return parts[1];
};

/**
 * Generate random PIN code
 * @param {number} length - PIN length
 * @returns {string} - Random PIN
 */
const generatePin = (length = 6) => {
  const digits = '0123456789';
  let pin = '';
  for (let i = 0; i < length; i++) {
    pin += digits.charAt(Math.floor(Math.random() * digits.length));
  }
  return pin;
};

module.exports = {
  hashPassword,
  comparePassword,
  generateDeviceToken,
  generateResellerToken,
  generateAdminToken,
  verifyToken,
  extractToken,
  generatePin
};
