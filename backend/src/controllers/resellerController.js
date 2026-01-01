/**
 * Nova Player - Reseller Controller
 * Handles reseller authentication and device operations
 */

const resellerService = require('../services/resellerService');
const { asyncHandler } = require('../middlewares/errorHandler');
const { HTTP_STATUS, SUCCESS_MESSAGES } = require('../utils/constants');

/**
 * POST /reseller/login
 * Authenticate reseller
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  const result = await resellerService.authenticateReseller(email, password);
  
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
    data: result
  });
});

/**
 * GET /reseller/profile
 * Get reseller profile (authenticated)
 */
const getProfile = asyncHandler(async (req, res) => {
  const resellerId = req.reseller.id;
  
  const profile = await resellerService.getResellerById(resellerId);
  
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: profile
  });
});

/**
 * POST /reseller/device/activate
 * Activate device using credits
 */
const activateDevice = asyncHandler(async (req, res) => {
  const resellerId = req.reseller.id;
  const { device_code, days } = req.body;
  
  // Calculate credit cost (1 credit per 30 days, rounded up)
  const creditCost = Math.ceil(days / 30);
  
  const result = await resellerService.activateDeviceWithCredits(
    resellerId,
    device_code,
    days,
    creditCost
  );
  
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: SUCCESS_MESSAGES.DEVICE_ACTIVATED,
    data: result
  });
});

/**
 * POST /reseller/device/start-trial
 * Start trial for a device
 */
const startDeviceTrial = asyncHandler(async (req, res) => {
  const resellerId = req.reseller.id;
  const { device_code } = req.body;
  
  const result = await resellerService.startDeviceTrial(resellerId, device_code);
  
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: SUCCESS_MESSAGES.TRIAL_STARTED,
    data: result
  });
});

module.exports = {
  login,
  getProfile,
  activateDevice,
  startDeviceTrial
};
