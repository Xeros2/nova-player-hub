/**
 * Nova Player - Admin Controller
 * Handles admin operations for devices and resellers
 */

const deviceService = require('../services/deviceService');
const resellerService = require('../services/resellerService');
const authService = require('../services/authService');
const { asyncHandler } = require('../middlewares/errorHandler');
const { HTTP_STATUS, SUCCESS_MESSAGES, ERROR_MESSAGES } = require('../utils/constants');

// Admin credentials (in production, use database)
const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USERNAME || 'admin',
  password: process.env.ADMIN_PASSWORD || 'admin123'
};

/**
 * POST /admin/login
 * Authenticate admin
 */
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  
  // Verify credentials
  if (username !== ADMIN_CREDENTIALS.username || password !== ADMIN_CREDENTIALS.password) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      error: ERROR_MESSAGES.INVALID_CREDENTIALS
    });
  }
  
  // Generate admin token
  const token = authService.generateAdminToken({ id: 'admin', username });
  
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
    data: { token }
  });
});

/**
 * GET /admin/devices
 * Get all devices with pagination
 */
const getDevices = asyncHandler(async (req, res) => {
  const { page, limit, status, reseller_id } = req.query;
  
  const result = await deviceService.getAllDevices(page, limit, { status, reseller_id });
  
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: result
  });
});

/**
 * POST /admin/device/activate
 * Activate a device
 */
const activateDevice = asyncHandler(async (req, res) => {
  const { device_code, days, lifetime } = req.body;
  
  let status;
  if (lifetime) {
    status = await deviceService.activateLifetime(device_code);
  } else {
    status = await deviceService.activateDevice(device_code, days);
  }
  
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: SUCCESS_MESSAGES.DEVICE_ACTIVATED,
    data: status
  });
});

/**
 * POST /admin/device/expire
 * Expire a device
 */
const expireDevice = asyncHandler(async (req, res) => {
  const { device_code } = req.body;
  
  const status = await deviceService.expireDevice(device_code);
  
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Device expired successfully',
    data: status
  });
});

/**
 * POST /admin/device/start-trial
 * Start trial for a device
 */
const startDeviceTrial = asyncHandler(async (req, res) => {
  const { device_code } = req.body;
  
  const status = await deviceService.startTrial(device_code);
  
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: SUCCESS_MESSAGES.TRIAL_STARTED,
    data: status
  });
});

/**
 * POST /admin/batch/start-trial
 * Start trial for multiple devices
 */
const batchStartTrial = asyncHandler(async (req, res) => {
  const { device_codes } = req.body;
  
  const results = {
    success: [],
    failed: []
  };
  
  for (const device_code of device_codes) {
    try {
      await deviceService.startTrial(device_code);
      results.success.push(device_code);
    } catch (error) {
      results.failed.push({
        device_code,
        error: error.message
      });
    }
  }
  
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: `Trial started for ${results.success.length} devices`,
    data: results
  });
});

/**
 * POST /admin/batch/expire
 * Expire multiple devices
 */
const batchExpire = asyncHandler(async (req, res) => {
  const { device_codes } = req.body;
  
  const results = {
    success: [],
    failed: []
  };
  
  for (const device_code of device_codes) {
    try {
      await deviceService.expireDevice(device_code);
      results.success.push(device_code);
    } catch (error) {
      results.failed.push({
        device_code,
        error: error.message
      });
    }
  }
  
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: `Expired ${results.success.length} devices`,
    data: results
  });
});

/**
 * POST /admin/batch/activate
 * Activate multiple devices
 */
const batchActivate = asyncHandler(async (req, res) => {
  const { device_codes, days } = req.body;
  
  const results = {
    success: [],
    failed: []
  };
  
  for (const device_code of device_codes) {
    try {
      await deviceService.activateDevice(device_code, days);
      results.success.push(device_code);
    } catch (error) {
      results.failed.push({
        device_code,
        error: error.message
      });
    }
  }
  
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: `Activated ${results.success.length} devices`,
    data: results
  });
});

/**
 * GET /admin/resellers
 * Get all resellers
 */
const getResellers = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  
  const result = await resellerService.getAllResellers(page, limit);
  
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: result
  });
});

/**
 * POST /admin/reseller/create
 * Create a new reseller
 */
const createReseller = asyncHandler(async (req, res) => {
  const { email, password, credits } = req.body;
  
  const reseller = await resellerService.createReseller(email, password, credits);
  
  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: SUCCESS_MESSAGES.RESELLER_CREATED,
    data: reseller
  });
});

/**
 * POST /admin/reseller/credit
 * Add credits to reseller
 */
const addResellerCredits = asyncHandler(async (req, res) => {
  const { reseller_id, amount } = req.body;
  
  const result = await resellerService.addCredits(reseller_id, amount);
  
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: SUCCESS_MESSAGES.CREDITS_ADDED,
    data: result
  });
});

/**
 * GET /admin/stats
 * Get system statistics
 */
const getStats = asyncHandler(async (req, res) => {
  const { Device, Reseller, Playlist } = require('../models');
  const { DEVICE_STATUS } = require('../utils/constants');
  
  const [
    totalDevices,
    activeDevices,
    trialDevices,
    expiredDevices,
    totalResellers,
    totalPlaylists
  ] = await Promise.all([
    Device.count(),
    Device.count({ where: { status: DEVICE_STATUS.ACTIVE } }),
    Device.count({ where: { status: DEVICE_STATUS.TRIAL } }),
    Device.count({ where: { status: DEVICE_STATUS.EXPIRED } }),
    Reseller.count(),
    Playlist.count()
  ]);
  
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: {
      devices: {
        total: totalDevices,
        active: activeDevices,
        trial: trialDevices,
        expired: expiredDevices
      },
      resellers: {
        total: totalResellers
      },
      playlists: {
        total: totalPlaylists
      }
    }
  });
});

/**
 * POST /admin/batch/start-trial-all
 * Start trial for ALL OPEN devices
 */
const batchStartTrialAllOpen = asyncHandler(async (req, res) => {
  const results = await deviceService.startTrialForAllOpen();
  
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: `Trial started for ${results.success.length} devices`,
    data: results
  });
});

/**
 * POST /admin/batch/activate-lifetime
 * Activate multiple devices with lifetime
 */
const batchActivateLifetime = asyncHandler(async (req, res) => {
  const { device_codes } = req.body;
  
  const results = await deviceService.batchActivateLifetime(device_codes);
  
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: `Lifetime activated for ${results.success.length} devices`,
    data: results
  });
});

module.exports = {
  login,
  getDevices,
  activateDevice,
  expireDevice,
  startDeviceTrial,
  batchStartTrial,
  batchExpire,
  batchActivate,
  batchStartTrialAllOpen,
  batchActivateLifetime,
  getResellers,
  createReseller,
  addResellerCredits,
  getStats
};
