/**
 * Nova Player - Playlist Routes
 * Routes for playlist management (requires device auth)
 */

import { Router } from 'express';
import * as playlistsController from './playlists.controller';
import { validateBody, validateParams } from '../../middlewares/validator';
import { authDevice } from '../admin/admin.middleware';

const router = Router();

// All routes require device authentication
router.use(authDevice);

/**
 * GET /api/device/playlists
 * Get all playlists for authenticated device
 */
router.get('/', playlistsController.getPlaylists);

/**
 * POST /api/device/playlists/add
 * Add a new playlist
 */
router.post(
  '/add',
  validateBody('playlistAdd'),
  playlistsController.addPlaylist
);

/**
 * PUT /api/device/playlists/:id
 * Update a playlist
 */
router.put(
  '/:id',
  validateParams('uuidParam'),
  validateBody('playlistUpdate'),
  playlistsController.updatePlaylist
);

/**
 * DELETE /api/device/playlists/:id
 * Delete a playlist
 */
router.delete(
  '/:id',
  validateParams('uuidParam'),
  playlistsController.deletePlaylist
);

export default router;
