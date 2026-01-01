/**
 * Nova Player - Device Controller
 * Handles device registration, authentication, and status
 */

const deviceService = require('../services/deviceService');
const { asyncHandler } = require('../middlewares/errorHandler');
const { HTTP_STATUS, SUCCESS_MESSAGES } = require('../utils/constants');

/**
 * POST /device/register
 * Register a new device
 */
const register = asyncHandler(async (req, res) => {
  const { device_code, pin } = req.body;
  
  const result = await deviceService.registerDevice(device_code, pin);
  
  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: SUCCESS_MESSAGES.DEVICE_REGISTERED,
    data: result
  });
});

/**
 * POST /device/auth
 * Authenticate device with PIN
 */
const authenticate = asyncHandler(async (req, res) => {
  const { device_code, pin } = req.body;
  
  const result = await deviceService.authenticateDevice(device_code, pin);
  
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
    data: result
  });
});

/**
 * GET /device/status
 * Get device status (requires device_code in query)
 */
const getStatus = asyncHandler(async (req, res) => {
  const { device_code } = req.query;
  
  const status = await deviceService.getDeviceStatus(device_code);
  
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: status
  });
});

/**
 * POST /device/start-trial
 * Start trial period for device
 */
const startTrial = asyncHandler(async (req, res) => {
  const { device_code } = req.body;
  
  const status = await deviceService.startTrial(device_code);
  
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: SUCCESS_MESSAGES.TRIAL_STARTED,
    data: status
  });
});

/**
 * POST /device/activate
 * Activate device (admin or with valid activation code)
 */
const activate = asyncHandler(async (req, res) => {
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

module.exports = {
  register,
  authenticate,
  getStatus,
  startTrial,
  activate
};
