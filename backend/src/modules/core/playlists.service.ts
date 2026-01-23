/**
 * Nova Player - Playlist Service
 * Business logic for playlist operations
 */

import { prisma } from '../../config/database';
import { ApiError } from '../../middlewares/errorHandler';
import { sanitizePlaylistUrl } from '../../utils/helpers';
import { ERROR_MESSAGES, DEVICE_STATUS } from '../../utils/constants';
import * as devicesService from './devices.service';
import logger from '../../utils/logger';

/**
 * Get playlists for a device
 */
export async function getDevicePlaylists(deviceCode: string) {
  const device = await prisma.device.findUnique({
    where: { deviceCode },
    include: {
      playlists: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!device) {
    throw ApiError.notFound(ERROR_MESSAGES.DEVICE_NOT_FOUND);
  }

  // Check if device can access playlists
  const status = devicesService.calculateDeviceStatus(device);
  const canAccess = [DEVICE_STATUS.TRIAL, DEVICE_STATUS.ACTIVE, DEVICE_STATUS.LIFETIME].includes(status);

  if (!canAccess) {
    return []; // Return empty array if device is not active
  }

  return device.playlists.map(p => ({
    id: p.id,
    name: p.name,
    url: p.url,
    created_at: p.createdAt,
  }));
}

/**
 * Add a playlist to a device
 */
export async function addPlaylist(deviceId: string, name: string, url: string) {
  const device = await prisma.device.findUnique({
    where: { id: deviceId },
  });

  if (!device) {
    throw ApiError.notFound(ERROR_MESSAGES.DEVICE_NOT_FOUND);
  }

  // Check permissions
  const status = devicesService.calculateDeviceStatus(device);
  const canAdd = [DEVICE_STATUS.TRIAL, DEVICE_STATUS.ACTIVE, DEVICE_STATUS.LIFETIME].includes(status);

  if (!canAdd) {
    throw ApiError.forbidden('Device must be active to add playlists');
  }

  const sanitizedUrl = sanitizePlaylistUrl(url);

  const playlist = await prisma.devicePlaylist.create({
    data: {
      deviceId,
      name,
      url: sanitizedUrl,
    },
  });

  logger.logDevice('Playlist added', device.deviceCode, { playlistId: playlist.id, name });

  return {
    id: playlist.id,
    name: playlist.name,
    url: playlist.url,
    created_at: playlist.createdAt,
  };
}

/**
 * Update a playlist
 */
export async function updatePlaylist(
  playlistId: string,
  deviceId: string,
  updates: { name?: string; url?: string }
) {
  const playlist = await prisma.devicePlaylist.findFirst({
    where: {
      id: playlistId,
      deviceId,
    },
  });

  if (!playlist) {
    throw ApiError.notFound(ERROR_MESSAGES.PLAYLIST_NOT_FOUND);
  }

  const data: { name?: string; url?: string } = {};

  if (updates.name) {
    data.name = updates.name;
  }

  if (updates.url) {
    data.url = sanitizePlaylistUrl(updates.url);
  }

  const updated = await prisma.devicePlaylist.update({
    where: { id: playlistId },
    data,
  });

  return {
    id: updated.id,
    name: updated.name,
    url: updated.url,
    created_at: updated.createdAt,
  };
}

/**
 * Delete a playlist
 */
export async function deletePlaylist(playlistId: string, deviceId: string) {
  const playlist = await prisma.devicePlaylist.findFirst({
    where: {
      id: playlistId,
      deviceId,
    },
  });

  if (!playlist) {
    throw ApiError.notFound(ERROR_MESSAGES.PLAYLIST_NOT_FOUND);
  }

  await prisma.devicePlaylist.delete({
    where: { id: playlistId },
  });

  logger.info('Playlist deleted', { playlistId, deviceId });

  return true;
}

/**
 * Get playlist count for a device
 */
export async function getPlaylistCount(deviceId: string): Promise<number> {
  return prisma.devicePlaylist.count({
    where: { deviceId },
  });
}

export default {
  getDevicePlaylists,
  addPlaylist,
  updatePlaylist,
  deletePlaylist,
  getPlaylistCount,
};
