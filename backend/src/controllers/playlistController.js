/**
 * Nova Player - Playlist Controller
 * Handles playlist CRUD operations
 */

const playlistService = require('../services/playlistService');
const { asyncHandler } = require('../middlewares/errorHandler');
const { HTTP_STATUS, SUCCESS_MESSAGES } = require('../utils/constants');

/**
 * GET /device/playlists
 * Get all playlists for authenticated device
 */
const getPlaylists = asyncHandler(async (req, res) => {
  const deviceId = req.device.id;
  
  const playlists = await playlistService.getDevicePlaylists(deviceId);
  
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: {
      playlists,
      count: playlists.length
    }
  });
});

/**
 * POST /device/playlists/add
 * Add a new playlist to device
 */
const addPlaylist = asyncHandler(async (req, res) => {
  const deviceId = req.device.id;
  const { name, url } = req.body;
  
  const playlist = await playlistService.addPlaylist(deviceId, name, url);
  
  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: SUCCESS_MESSAGES.PLAYLIST_ADDED,
    data: playlist
  });
});

/**
 * DELETE /device/playlists/:id
 * Delete a playlist
 */
const deletePlaylist = asyncHandler(async (req, res) => {
  const deviceId = req.device.id;
  const playlistId = req.params.id;
  
  await playlistService.deletePlaylist(playlistId, deviceId);
  
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: SUCCESS_MESSAGES.PLAYLIST_DELETED
  });
});

/**
 * PUT /device/playlists/:id
 * Update a playlist
 */
const updatePlaylist = asyncHandler(async (req, res) => {
  const deviceId = req.device.id;
  const playlistId = req.params.id;
  const updates = req.body;
  
  const playlist = await playlistService.updatePlaylist(playlistId, deviceId, updates);
  
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: playlist
  });
});

module.exports = {
  getPlaylists,
  addPlaylist,
  deletePlaylist,
  updatePlaylist
};
