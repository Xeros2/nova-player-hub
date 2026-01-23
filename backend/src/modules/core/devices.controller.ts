/**
 * Nova Player - Device Controller
 * HTTP handlers for device operations
 */

import { Request, Response } from 'express';
import { asyncHandler } from '../../middlewares/errorHandler';
import * as devicesService from './devices.service';
import { HTTP_STATUS, SUCCESS_MESSAGES } from '../../utils/constants';

/**
 * POST /api/device/register
 * Register a new device
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { device_code, pin, platform, player_version } = req.body;

  const result = await devicesService.registerDevice(
    device_code,
    pin,
    platform,
    player_version
  );

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: SUCCESS_MESSAGES.DEVICE_REGISTERED,
    data: result,
  });
});

/**
 * POST /api/device/auth
 * Authenticate device with PIN
 */
export const authenticate = asyncHandler(async (req: Request, res: Response) => {
  const { device_code, pin } = req.body;

  const result = await devicesService.authenticateDevice(device_code, pin);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
    data: result,
  });
});

/**
 * POST /api/device/status
 * Get device status
 */
export const getStatus = asyncHandler(async (req: Request, res: Response) => {
  const { device_code } = req.body;

  const status = await devicesService.getDeviceStatus(device_code);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: status,
  });
});

/**
 * GET /api/device/playlists
 * Get device playlists (requires device auth via token)
 */
export const getPlaylists = asyncHandler(async (req: Request, res: Response) => {
  const { device_code } = req.body;
  
  // Import playlist service
  const playlistsService = await import('./playlists.service');
  
  const playlists = await playlistsService.getDevicePlaylists(device_code);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: {
      playlists,
      count: playlists.length,
    },
  });
});

export default {
  register,
  authenticate,
  getStatus,
  getPlaylists,
};
