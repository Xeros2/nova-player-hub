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

// NOTE: startTrial removed - can only be triggered by Admin or Reseller

/**
 * GET /device/player-info
 * Get complete player info (status, playlists, trial info)
 * Used by IPTV player apps
 */
const getPlayerInfo = asyncHandler(async (req, res) => {
  const deviceId = req.device.id;
  const { Device } = require('../models');
  const playlistService = require('../services/playlistService');
  const statusService = require('../services/statusService');
  
  const device = await Device.findByPk(deviceId);
  if (!device) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      error: 'Device not found'
    });
  }
  
  const statusResponse = statusService.getStatusResponse(device);
  
  // Get playlists only if device can view them
  let playlists = [];
  if (statusResponse.permissions.can_view_playlists) {
    try {
      playlists = await playlistService.getDevicePlaylists(deviceId);
    } catch (error) {
      // If playlist retrieval fails due to status, just return empty array
      playlists = [];
    }
  }
  
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: {
      ...statusResponse,
      playlists,
      server_time: new Date().toISOString()
    }
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
  getPlayerInfo,
  activate
};
