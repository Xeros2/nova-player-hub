/**
 * Nova Player - Status Service
 * Server-side device status calculation
 * 
 * CRITICAL: Status is NEVER stored directly.
 * It is always calculated dynamically based on dates.
 */

const { DEVICE_STATUS } = require('../utils/constants');
const logger = require('../utils/logger');

/**
 * Calculate the current status of a device
 * This is the ONLY source of truth for device status
 * 
 * @param {object} device - Device object from database
 * @returns {string} - Calculated status
 */
const calculateDeviceStatus = (device) => {
  const now = new Date();
  
  // Priority 1: Lifetime activation
  if (device.lifetime === true) {
    return DEVICE_STATUS.LIFETIME;
  }
  
  // Priority 2: Active paid subscription
  if (device.activated_until) {
    const activatedUntil = new Date(device.activated_until);
    if (activatedUntil > now) {
      return DEVICE_STATUS.ACTIVE;
    }
  }
  
  // Priority 3: Trial period
  if (device.trial_started_at && device.trial_expires_at) {
    const trialExpires = new Date(device.trial_expires_at);
    if (trialExpires > now) {
      return DEVICE_STATUS.TRIAL;
    }
    // Trial has expired
    return DEVICE_STATUS.EXPIRED;
  }
  
  // Priority 4: Check if activation expired
  if (device.activated_until) {
    const activatedUntil = new Date(device.activated_until);
    if (activatedUntil <= now) {
      return DEVICE_STATUS.EXPIRED;
    }
  }
  
  // Default: Device is open (registered but not activated)
  return DEVICE_STATUS.OPEN;
};

/**
 * Update the stored status based on calculation
 * This syncs the database with the calculated status
 * 
 * @param {object} device - Device model instance
 * @returns {Promise<object>} - Updated device
 */
const syncDeviceStatus = async (device) => {
  const calculatedStatus = calculateDeviceStatus(device);
  
  // Only update if status has changed
  if (device.status !== calculatedStatus) {
    logger.logDevice('Status changed', device.device_code, {
      from: device.status,
      to: calculatedStatus
    });
    
    device.status = calculatedStatus;
    await device.save();
  }
  
  return device;
};

/**
 * Get device status response object
 * Includes calculated status and relevant dates
 * 
 * @param {object} device - Device object
 * @returns {object} - Status response
 */
const getStatusResponse = (device) => {
  const status = calculateDeviceStatus(device);
  const now = new Date();
  
  const response = {
    device_code: device.device_code,
    status,
    lifetime: device.lifetime || false,
    created_at: device.createdAt
  };
  
  // Include trial info if applicable
  if (device.trial_started_at) {
    response.trial = {
      started_at: device.trial_started_at,
      expires_at: device.trial_expires_at,
      is_expired: new Date(device.trial_expires_at) <= now,
      days_remaining: Math.max(0, Math.ceil((new Date(device.trial_expires_at) - now) / (1000 * 60 * 60 * 24)))
    };
  }
  
  // Include activation info if applicable
  if (device.activated_until) {
    response.activation = {
      expires_at: device.activated_until,
      is_expired: new Date(device.activated_until) <= now,
      days_remaining: Math.max(0, Math.ceil((new Date(device.activated_until) - now) / (1000 * 60 * 60 * 24)))
    };
  }
  
  // Include permissions based on status
  response.permissions = getStatusPermissions(status);
  
  return response;
};

/**
 * Get permissions based on device status
 * 
 * @param {string} status - Device status
 * @returns {object} - Permissions object
 */
const getStatusPermissions = (status) => {
  const basePermissions = {
    can_view_playlists: false,
    can_add_playlists: false,
    can_stream: false,
    can_use_features: false
  };
  
  switch (status) {
    case DEVICE_STATUS.LIFETIME:
    case DEVICE_STATUS.ACTIVE:
      return {
        can_view_playlists: true,
        can_add_playlists: true,
        can_stream: true,
        can_use_features: true
      };
    
    case DEVICE_STATUS.TRIAL:
      return {
        can_view_playlists: true,
        can_add_playlists: true,
        can_stream: true,
        can_use_features: false // Limited features during trial
      };
    
    case DEVICE_STATUS.EXPIRED:
      return {
        can_view_playlists: true,
        can_add_playlists: false,
        can_stream: false,
        can_use_features: false
      };
    
    case DEVICE_STATUS.OPEN:
    default:
      return basePermissions;
  }
};

/**
 * Check if device can start trial
 * 
 * @param {object} device - Device object
 * @returns {boolean} - True if trial can be started
 */
const canStartTrial = (device) => {
  return device.trial_started_at === null;
};

/**
 * Check if device is currently active (can use full features)
 * 
 * @param {object} device - Device object
 * @returns {boolean} - True if device is active
 */
const isDeviceActive = (device) => {
  const status = calculateDeviceStatus(device);
  return [DEVICE_STATUS.ACTIVE, DEVICE_STATUS.LIFETIME, DEVICE_STATUS.TRIAL].includes(status);
};

module.exports = {
  calculateDeviceStatus,
  syncDeviceStatus,
  getStatusResponse,
  getStatusPermissions,
  canStartTrial,
  isDeviceActive
};
