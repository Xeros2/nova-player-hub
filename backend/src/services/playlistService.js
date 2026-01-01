/**
 * Nova Player - Playlist Service
 * Business logic for playlist operations
 */

const { Playlist, Device } = require('../models');
const statusService = require('./statusService');
const { ERROR_MESSAGES, DEVICE_STATUS } = require('../utils/constants');
const logger = require('../utils/logger');

/**
 * Get all playlists for a device
 * @param {string} deviceId - Device UUID
 * @returns {Promise<array>} - List of playlists
 */
const getDevicePlaylists = async (deviceId) => {
  const device = await Device.findByPk(deviceId);
  if (!device) {
    throw new Error(ERROR_MESSAGES.DEVICE_NOT_FOUND);
  }
  
  const playlists = await Playlist.findAll({
    where: { device_id: deviceId },
    order: [['createdAt', 'DESC']]
  });
  
  return playlists.map(playlist => ({
    id: playlist.id,
    name: playlist.name,
    url: playlist.url,
    created_at: playlist.createdAt
  }));
};

/**
 * Add a playlist to a device
 * @param {string} deviceId - Device UUID
 * @param {string} name - Playlist name
 * @param {string} url - Playlist URL
 * @returns {Promise<object>} - Created playlist
 */
const addPlaylist = async (deviceId, name, url) => {
  const device = await Device.findByPk(deviceId);
  if (!device) {
    throw new Error(ERROR_MESSAGES.DEVICE_NOT_FOUND);
  }
  
  // Check if device has permission to add playlists
  const status = statusService.calculateDeviceStatus(device);
  const permissions = statusService.getStatusPermissions(status);
  
  if (!permissions.can_add_playlists) {
    throw new Error('Device status does not allow adding playlists');
  }
  
  // Sanitize and validate URL
  const sanitizedUrl = sanitizePlaylistUrl(url);
  
  const playlist = await Playlist.create({
    device_id: deviceId,
    name: name.trim(),
    url: sanitizedUrl
  });
  
  logger.logDevice('Playlist added', device.device_code, {
    playlist_id: playlist.id,
    name: playlist.name
  });
  
  return {
    id: playlist.id,
    name: playlist.name,
    url: playlist.url,
    created_at: playlist.createdAt
  };
};

/**
 * Delete a playlist
 * @param {string} playlistId - Playlist UUID
 * @param {string} deviceId - Device UUID (for verification)
 * @returns {Promise<boolean>} - True if deleted
 */
const deletePlaylist = async (playlistId, deviceId) => {
  const playlist = await Playlist.findOne({
    where: {
      id: playlistId,
      device_id: deviceId
    }
  });
  
  if (!playlist) {
    throw new Error(ERROR_MESSAGES.PLAYLIST_NOT_FOUND);
  }
  
  await playlist.destroy();
  
  logger.info('Playlist deleted', { playlistId, deviceId });
  
  return true;
};

/**
 * Update a playlist
 * @param {string} playlistId - Playlist UUID
 * @param {string} deviceId - Device UUID
 * @param {object} updates - Fields to update
 * @returns {Promise<object>} - Updated playlist
 */
const updatePlaylist = async (playlistId, deviceId, updates) => {
  const playlist = await Playlist.findOne({
    where: {
      id: playlistId,
      device_id: deviceId
    }
  });
  
  if (!playlist) {
    throw new Error(ERROR_MESSAGES.PLAYLIST_NOT_FOUND);
  }
  
  if (updates.name) {
    playlist.name = updates.name.trim();
  }
  
  if (updates.url) {
    playlist.url = sanitizePlaylistUrl(updates.url);
  }
  
  await playlist.save();
  
  return {
    id: playlist.id,
    name: playlist.name,
    url: playlist.url,
    created_at: playlist.createdAt
  };
};

/**
 * Get playlist count for a device
 * @param {string} deviceId - Device UUID
 * @returns {Promise<number>} - Playlist count
 */
const getPlaylistCount = async (deviceId) => {
  return await Playlist.count({ where: { device_id: deviceId } });
};

/**
 * Sanitize playlist URL
 * @param {string} url - Raw URL
 * @returns {string} - Sanitized URL
 */
const sanitizePlaylistUrl = (url) => {
  // Trim whitespace
  let sanitized = url.trim();
  
  // Ensure URL has protocol
  if (!sanitized.startsWith('http://') && !sanitized.startsWith('https://')) {
    sanitized = 'http://' + sanitized;
  }
  
  // Validate URL format
  try {
    new URL(sanitized);
  } catch (error) {
    throw new Error('Invalid playlist URL format');
  }
  
  return sanitized;
};

module.exports = {
  getDevicePlaylists,
  addPlaylist,
  deletePlaylist,
  updatePlaylist,
  getPlaylistCount
};
