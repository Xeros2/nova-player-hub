/**
 * Nova Player - Device Routes
 * Public API routes for device operations (no auth required)
 */

import { Router } from 'express';
import * as devicesController from './devices.controller';
import { validateBody } from '../../middlewares/validator';
import { registrationLimiter, statusLimiter } from '../../middlewares/rateLimiter';

const router = Router();

/**
 * POST /api/device/register
 * Register a new device
 * Rate limited: 10 per hour
 */
router.post(
  '/register',
  registrationLimiter,
  validateBody('deviceRegister'),
  devicesController.register
);

/**
 * POST /api/device/auth
 * Authenticate device with PIN
 */
router.post(
  '/auth',
  validateBody('deviceAuth'),
  devicesController.authenticate
);

/**
 * POST /api/device/status
 * Get device status
 * Rate limited: 60 per minute
 */
router.post(
  '/status',
  statusLimiter,
  validateBody('deviceStatus'),
  devicesController.getStatus
);

/**
 * POST /api/device/playlists
 * Get device playlists
 */
router.post(
  '/playlists',
  validateBody('deviceStatus'),
  devicesController.getPlaylists
);

export default router;
