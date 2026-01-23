/**
 * Nova Player - Playlist Controller
 * HTTP handlers for playlist operations
 */

import { Request, Response } from 'express';
import { asyncHandler } from '../../middlewares/errorHandler';
import * as playlistsService from './playlists.service';
import { HTTP_STATUS, SUCCESS_MESSAGES } from '../../utils/constants';

// Extend request type for device auth
interface DeviceRequest extends Request {
  device?: {
    id: string;
    deviceCode: string;
  };
}

/**
 * GET /api/device/playlists
 * Get all playlists for authenticated device
 */
export const getPlaylists = asyncHandler(async (req: DeviceRequest, res: Response) => {
  const deviceId = req.device!.id;
  const device = await import('../../config/database').then(m => m.prisma.device.findUnique({
    where: { id: deviceId },
  }));

  if (!device) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      error: 'Device not found',
    });
  }

  const playlists = await playlistsService.getDevicePlaylists(device.deviceCode);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: {
      playlists,
      count: playlists.length,
    },
  });
});

/**
 * POST /api/device/playlists/add
 * Add a new playlist
 */
export const addPlaylist = asyncHandler(async (req: DeviceRequest, res: Response) => {
  const deviceId = req.device!.id;
  const { name, url } = req.body;

  const playlist = await playlistsService.addPlaylist(deviceId, name, url);

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: SUCCESS_MESSAGES.PLAYLIST_ADDED,
    data: playlist,
  });
});

/**
 * PUT /api/device/playlists/:id
 * Update a playlist
 */
export const updatePlaylist = asyncHandler(async (req: DeviceRequest, res: Response) => {
  const deviceId = req.device!.id;
  const playlistId = req.params.id;
  const updates = req.body;

  const playlist = await playlistsService.updatePlaylist(playlistId, deviceId, updates);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: playlist,
  });
});

/**
 * DELETE /api/device/playlists/:id
 * Delete a playlist
 */
export const deletePlaylist = asyncHandler(async (req: DeviceRequest, res: Response) => {
  const deviceId = req.device!.id;
  const playlistId = req.params.id;

  await playlistsService.deletePlaylist(playlistId, deviceId);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: SUCCESS_MESSAGES.PLAYLIST_DELETED,
  });
});

export default {
  getPlaylists,
  addPlaylist,
  updatePlaylist,
  deletePlaylist,
};
