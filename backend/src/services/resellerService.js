/**
 * Nova Player - Reseller Service
 * Business logic for reseller operations
 */

const { Reseller, Device } = require('../models');
const authService = require('./authService');
const deviceService = require('./deviceService');
const { ERROR_MESSAGES, SUCCESS_MESSAGES } = require('../utils/constants');
const logger = require('../utils/logger');

/**
 * Create a new reseller account
 * @param {string} email - Reseller email
 * @param {string} password - Plain text password
 * @param {number} initialCredits - Initial credit balance
 * @returns {Promise<object>} - Created reseller
 */
const createReseller = async (email, password, initialCredits = 0) => {
  // Check if reseller already exists
  const existingReseller = await Reseller.findOne({ where: { email } });
  if (existingReseller) {
    throw new Error(ERROR_MESSAGES.RESELLER_EXISTS);
  }
  
  // Hash password
  const passwordHash = await authService.hashPassword(password);
  
  // Create reseller
  const reseller = await Reseller.create({
    email,
    password_hash: passwordHash,
    credits: initialCredits
  });
  
  logger.info('Reseller created', { email, initialCredits });
  
  return {
    id: reseller.id,
    email: reseller.email,
    credits: reseller.credits,
    created_at: reseller.createdAt
  };
};

/**
 * Authenticate reseller
 * @param {string} email - Reseller email
 * @param {string} password - Plain text password
 * @returns {Promise<object>} - Reseller and token
 */
const authenticateReseller = async (email, password) => {
  // Find reseller
  const reseller = await Reseller.findOne({ where: { email } });
  if (!reseller) {
    throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
  }
  
  // Check if active
  if (!reseller.is_active) {
    throw new Error(ERROR_MESSAGES.FORBIDDEN);
  }
  
  // Verify password
  const isValidPassword = await authService.comparePassword(password, reseller.password_hash);
  if (!isValidPassword) {
    logger.logAuth('Reseller login failed', email, false);
    throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
  }
  
  // Generate token
  const token = authService.generateResellerToken(reseller);
  
  logger.logAuth('Reseller login success', email);
  
  return {
    reseller: {
      id: reseller.id,
      email: reseller.email,
      credits: reseller.credits
    },
    token
  };
};

/**
 * Get reseller by ID
 * @param {string} resellerId - Reseller UUID
 * @returns {Promise<object>} - Reseller data
 */
const getResellerById = async (resellerId) => {
  const reseller = await Reseller.findByPk(resellerId, {
    include: [{ model: Device, as: 'devices' }]
  });
  
  if (!reseller) {
    throw new Error(ERROR_MESSAGES.RESELLER_NOT_FOUND);
  }
  
  return {
    id: reseller.id,
    email: reseller.email,
    credits: reseller.credits,
    is_active: reseller.is_active,
    devices_count: reseller.devices?.length || 0,
    created_at: reseller.createdAt
  };
};

/**
 * Add credits to reseller
 * @param {string} resellerId - Reseller UUID
 * @param {number} amount - Credits to add
 * @returns {Promise<object>} - Updated reseller
 */
const addCredits = async (resellerId, amount) => {
  const reseller = await Reseller.findByPk(resellerId);
  if (!reseller) {
    throw new Error(ERROR_MESSAGES.RESELLER_NOT_FOUND);
  }
  
  const newBalance = await reseller.addCredits(amount);
  
  logger.info('Credits added to reseller', {
    resellerId,
    amount,
    newBalance
  });
  
  return {
    id: reseller.id,
    email: reseller.email,
    credits: newBalance
  };
};

/**
 * Deduct credits from reseller
 * @param {string} resellerId - Reseller UUID
 * @param {number} amount - Credits to deduct
 * @returns {Promise<number>} - New balance
 */
const deductCredits = async (resellerId, amount) => {
  const reseller = await Reseller.findByPk(resellerId);
  if (!reseller) {
    throw new Error(ERROR_MESSAGES.RESELLER_NOT_FOUND);
  }
  
  if (!reseller.hasCredits(amount)) {
    throw new Error(ERROR_MESSAGES.INSUFFICIENT_CREDITS);
  }
  
  const newBalance = await reseller.deductCredits(amount);
  
  logger.info('Credits deducted from reseller', {
    resellerId,
    amount,
    newBalance
  });
  
  return newBalance;
};

/**
 * Activate device using reseller credits
 * @param {string} resellerId - Reseller UUID
 * @param {string} deviceCode - Device code
 * @param {number} days - Activation duration
 * @param {number} creditCost - Credits to deduct
 * @returns {Promise<object>} - Activation result
 */
const activateDeviceWithCredits = async (resellerId, deviceCode, days, creditCost = 1) => {
  const reseller = await Reseller.findByPk(resellerId);
  if (!reseller) {
    throw new Error(ERROR_MESSAGES.RESELLER_NOT_FOUND);
  }
  
  // Check credits
  if (!reseller.hasCredits(creditCost)) {
    throw new Error(ERROR_MESSAGES.INSUFFICIENT_CREDITS);
  }
  
  // Activate device
  const deviceStatus = await deviceService.activateDevice(deviceCode, days, resellerId);
  
  // Deduct credits
  const newBalance = await reseller.deductCredits(creditCost);
  
  logger.info('Device activated by reseller', {
    resellerId,
    deviceCode,
    days,
    creditCost,
    newBalance
  });
  
  return {
    device: deviceStatus,
    credits_remaining: newBalance
  };
};

/**
 * Start trial for device (reseller action)
 * @param {string} resellerId - Reseller UUID
 * @param {string} deviceCode - Device code
 * @returns {Promise<object>} - Trial result
 */
const startDeviceTrial = async (resellerId, deviceCode) => {
  const reseller = await Reseller.findByPk(resellerId);
  if (!reseller) {
    throw new Error(ERROR_MESSAGES.RESELLER_NOT_FOUND);
  }
  
  const deviceStatus = await deviceService.startTrial(deviceCode);
  
  // Associate device with reseller
  const device = await Device.findOne({ where: { device_code: deviceCode } });
  if (device && !device.reseller_id) {
    device.reseller_id = resellerId;
    await device.save();
  }
  
  logger.info('Trial started by reseller', {
    resellerId,
    deviceCode
  });
  
  return {
    device: deviceStatus
  };
};

/**
 * Get all resellers with pagination
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise<object>} - Paginated resellers
 */
const getAllResellers = async (page = 1, limit = 50) => {
  const offset = (page - 1) * limit;
  
  const { count, rows } = await Reseller.findAndCountAll({
    limit,
    offset,
    order: [['createdAt', 'DESC']],
    attributes: ['id', 'email', 'credits', 'is_active', 'createdAt']
  });
  
  // Get device counts
  const resellers = await Promise.all(rows.map(async (reseller) => {
    const deviceCount = await Device.count({ where: { reseller_id: reseller.id } });
    return {
      id: reseller.id,
      email: reseller.email,
      credits: reseller.credits,
      is_active: reseller.is_active,
      devices_count: deviceCount,
      created_at: reseller.createdAt
    };
  }));
  
  return {
    resellers,
    pagination: {
      total: count,
      page,
      limit,
      pages: Math.ceil(count / limit)
    }
  };
};

/**
 * Toggle reseller active status
 * @param {string} resellerId - Reseller UUID
 * @param {boolean} isActive - Active status
 * @returns {Promise<object>} - Updated reseller
 */
const setResellerStatus = async (resellerId, isActive) => {
  const reseller = await Reseller.findByPk(resellerId);
  if (!reseller) {
    throw new Error(ERROR_MESSAGES.RESELLER_NOT_FOUND);
  }
  
  reseller.is_active = isActive;
  await reseller.save();
  
  logger.info('Reseller status updated', { resellerId, isActive });
  
  return {
    id: reseller.id,
    email: reseller.email,
    is_active: reseller.is_active
  };
};

module.exports = {
  createReseller,
  authenticateReseller,
  getResellerById,
  addCredits,
  deductCredits,
  activateDeviceWithCredits,
  startDeviceTrial,
  getAllResellers,
  setResellerStatus
};
