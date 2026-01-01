/**
 * Nova Player - Device Service
 * Business logic for device operations
 */

const { Device } = require('../models');
const authService = require('./authService');
const statusService = require('./statusService');
const { DEVICE_STATUS, TRIAL_CONFIG, ERROR_MESSAGES, ACTIVATION_DURATIONS } = require('../utils/constants');
const logger = require('../utils/logger');

/**
 * Register a new device
 * @param {string} deviceCode - Unique device code
 * @param {string} pin - Plain text PIN
 * @returns {Promise<object>} - Created device and token
 */
const registerDevice = async (deviceCode, pin) => {
  // Check if device already exists
  const existingDevice = await Device.findOne({ where: { device_code: deviceCode } });
  if (existingDevice) {
    throw new Error(ERROR_MESSAGES.DEVICE_EXISTS);
  }
  
  // Hash the PIN
  const pinHash = await authService.hashPassword(pin);
  
  // Create the device
  const device = await Device.create({
    device_code: deviceCode,
    pin_hash: pinHash,
    status: DEVICE_STATUS.OPEN
  });
  
  // Generate token
  const token = authService.generateDeviceToken(device);
  
  logger.logDevice('Registered', deviceCode);
  
  return {
    device: {
      id: device.id,
      device_code: device.device_code,
      status: device.status,
      created_at: device.createdAt
    },
    token
  };
};

/**
 * Authenticate device with PIN
 * @param {string} deviceCode - Device code
 * @param {string} pin - Plain text PIN
 * @returns {Promise<object>} - Device and token
 */
const authenticateDevice = async (deviceCode, pin) => {
  // Find device
  const device = await Device.findOne({ where: { device_code: deviceCode } });
  if (!device) {
    throw new Error(ERROR_MESSAGES.DEVICE_NOT_FOUND);
  }
  
  // Verify PIN
  const isValidPin = await authService.comparePassword(pin, device.pin_hash);
  if (!isValidPin) {
    logger.logAuth('Device login failed - invalid PIN', deviceCode, false);
    throw new Error(ERROR_MESSAGES.INVALID_PIN);
  }
  
  // Sync and get current status
  await statusService.syncDeviceStatus(device);
  
  // Generate token
  const token = authService.generateDeviceToken(device);
  
  logger.logAuth('Device login success', deviceCode);
  
  return {
    device: statusService.getStatusResponse(device),
    token
  };
};

/**
 * Get device status (calculated server-side)
 * @param {string} deviceCode - Device code
 * @returns {Promise<object>} - Status response
 */
const getDeviceStatus = async (deviceCode) => {
  const device = await Device.findOne({ where: { device_code: deviceCode } });
  if (!device) {
    throw new Error(ERROR_MESSAGES.DEVICE_NOT_FOUND);
  }
  
  // Sync status with database
  await statusService.syncDeviceStatus(device);
  
  return statusService.getStatusResponse(device);
};

/**
 * Start trial period for device
 * @param {string} deviceCode - Device code
 * @returns {Promise<object>} - Updated status
 */
const startTrial = async (deviceCode) => {
  const device = await Device.findOne({ where: { device_code: deviceCode } });
  if (!device) {
    throw new Error(ERROR_MESSAGES.DEVICE_NOT_FOUND);
  }
  
  // Check if trial already used
  if (!statusService.canStartTrial(device)) {
    throw new Error(ERROR_MESSAGES.TRIAL_ALREADY_USED);
  }
  
  // Set trial dates
  const now = new Date();
  const trialEnd = new Date(now);
  trialEnd.setDate(trialEnd.getDate() + TRIAL_CONFIG.DURATION_DAYS);
  
  device.trial_started_at = now;
  device.trial_expires_at = trialEnd;
  device.status = DEVICE_STATUS.TRIAL;
  
  await device.save();
  
  logger.logDevice('Trial started', deviceCode, {
    expires_at: trialEnd.toISOString()
  });
  
  return statusService.getStatusResponse(device);
};

/**
 * Activate device with duration
 * @param {string} deviceCode - Device code
 * @param {number} days - Activation duration in days
 * @param {string} resellerId - Optional reseller ID
 * @returns {Promise<object>} - Updated status
 */
const activateDevice = async (deviceCode, days, resellerId = null) => {
  const device = await Device.findOne({ where: { device_code: deviceCode } });
  if (!device) {
    throw new Error(ERROR_MESSAGES.DEVICE_NOT_FOUND);
  }
  
  // Calculate new expiration date
  const now = new Date();
  let expirationDate;
  
  // If device is already active, extend from current expiration
  if (device.activated_until && new Date(device.activated_until) > now) {
    expirationDate = new Date(device.activated_until);
  } else {
    expirationDate = now;
  }
  
  expirationDate.setDate(expirationDate.getDate() + days);
  
  device.activated_until = expirationDate;
  device.status = DEVICE_STATUS.ACTIVE;
  
  if (resellerId) {
    device.reseller_id = resellerId;
  }
  
  await device.save();
  
  logger.logDevice('Activated', deviceCode, {
    days,
    expires_at: expirationDate.toISOString(),
    reseller_id: resellerId
  });
  
  return statusService.getStatusResponse(device);
};

/**
 * Activate device with lifetime access
 * @param {string} deviceCode - Device code
 * @param {string} resellerId - Optional reseller ID
 * @returns {Promise<object>} - Updated status
 */
const activateLifetime = async (deviceCode, resellerId = null) => {
  const device = await Device.findOne({ where: { device_code: deviceCode } });
  if (!device) {
    throw new Error(ERROR_MESSAGES.DEVICE_NOT_FOUND);
  }
  
  device.lifetime = true;
  device.status = DEVICE_STATUS.LIFETIME;
  
  if (resellerId) {
    device.reseller_id = resellerId;
  }
  
  await device.save();
  
  logger.logDevice('Lifetime activated', deviceCode, { reseller_id: resellerId });
  
  return statusService.getStatusResponse(device);
};

/**
 * Expire device
 * @param {string} deviceCode - Device code
 * @returns {Promise<object>} - Updated status
 */
const expireDevice = async (deviceCode) => {
  const device = await Device.findOne({ where: { device_code: deviceCode } });
  if (!device) {
    throw new Error(ERROR_MESSAGES.DEVICE_NOT_FOUND);
  }
  
  device.activated_until = new Date();
  device.lifetime = false;
  device.trial_expires_at = device.trial_started_at ? new Date() : null;
  device.status = DEVICE_STATUS.EXPIRED;
  
  await device.save();
  
  logger.logDevice('Expired', deviceCode);
  
  return statusService.getStatusResponse(device);
};

/**
 * Get all devices with pagination
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @param {object} filters - Optional filters
 * @returns {Promise<object>} - Paginated devices
 */
const getAllDevices = async (page = 1, limit = 50, filters = {}) => {
  const offset = (page - 1) * limit;
  const where = {};
  
  if (filters.status) {
    where.status = filters.status;
  }
  
  if (filters.reseller_id) {
    where.reseller_id = filters.reseller_id;
  }
  
  const { count, rows } = await Device.findAndCountAll({
    where,
    limit,
    offset,
    order: [['createdAt', 'DESC']],
    include: ['reseller']
  });
  
  // Calculate status for each device
  const devices = rows.map(device => ({
    ...statusService.getStatusResponse(device),
    reseller: device.reseller ? {
      id: device.reseller.id,
      email: device.reseller.email
    } : null
  }));
  
  return {
    devices,
    pagination: {
      total: count,
      page,
      limit,
      pages: Math.ceil(count / limit)
    }
  };
};

/**
 * Get device by ID
 * @param {string} deviceId - Device UUID
 * @returns {Promise<object>} - Device with status
 */
const getDeviceById = async (deviceId) => {
  const device = await Device.findByPk(deviceId);
  if (!device) {
    throw new Error(ERROR_MESSAGES.DEVICE_NOT_FOUND);
  }
  
  return statusService.getStatusResponse(device);
};

/**
 * Start trial for all OPEN devices
 * @returns {Promise<object>} - Results with success and failed arrays
 */
const startTrialForAllOpen = async () => {
  const { Op } = require('sequelize');
  
  const openDevices = await Device.findAll({
    where: {
      trial_started_at: null,
      lifetime: false,
      activated_until: null
    }
  });
  
  const results = {
    success: [],
    failed: [],
    total: openDevices.length
  };
  
  for (const device of openDevices) {
    try {
      await startTrial(device.device_code);
      results.success.push(device.device_code);
    } catch (error) {
      results.failed.push({
        device_code: device.device_code,
        error: error.message
      });
    }
  }
  
  logger.info('Batch trial started for all OPEN devices', {
    total: results.total,
    success: results.success.length,
    failed: results.failed.length
  });
  
  return results;
};

/**
 * Batch activate devices with lifetime
 * @param {string[]} deviceCodes - Array of device codes
 * @returns {Promise<object>} - Results with success and failed arrays
 */
const batchActivateLifetime = async (deviceCodes) => {
  const results = {
    success: [],
    failed: []
  };
  
  for (const deviceCode of deviceCodes) {
    try {
      await activateLifetime(deviceCode);
      results.success.push(deviceCode);
    } catch (error) {
      results.failed.push({
        device_code: deviceCode,
        error: error.message
      });
    }
  }
  
  logger.info('Batch lifetime activation completed', {
    success: results.success.length,
    failed: results.failed.length
  });
  
  return results;
};

module.exports = {
  registerDevice,
  authenticateDevice,
  getDeviceStatus,
  startTrial,
  activateDevice,
  activateLifetime,
  expireDevice,
  getAllDevices,
  getDeviceById,
  startTrialForAllOpen,
  batchActivateLifetime
};
