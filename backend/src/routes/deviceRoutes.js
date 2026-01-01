/**
 * Nova Player - Device Routes
 * Routes for device operations
 */

const express = require('express');
const router = express.Router();

const deviceController = require('../controllers/deviceController');
const playlistController = require('../controllers/playlistController');
const { authenticateDevice } = require('../middlewares/authMiddleware');
const { validateBody, validateQuery, validateParams } = require('../middlewares/validator');
const { statusLimiter, registrationLimiter, trialLimiter } = require('../middlewares/rateLimiter');

/**
 * @route   POST /device/register
 * @desc    Register a new device
 * @access  Public (rate limited)
 */
router.post(
  '/register',
  registrationLimiter,
  validateBody('deviceRegister'),
  deviceController.register
);

/**
 * @route   POST /device/auth
 * @desc    Authenticate device with PIN
 * @access  Public
 */
router.post(
  '/auth',
  validateBody('deviceAuth'),
  deviceController.authenticate
);

/**
 * @route   GET /device/status
 * @desc    Get device status (calculated server-side)
 * @access  Public (rate limited)
 */
router.get(
  '/status',
  statusLimiter,
  validateQuery('deviceStatus'),
  deviceController.getStatus
);

/**
 * @route   POST /device/start-trial
 * @desc    Start trial period for device
 * @access  Public (rate limited)
 */
router.post(
  '/start-trial',
  trialLimiter,
  validateBody('deviceStatus'),
  deviceController.startTrial
);

/**
 * @route   POST /device/activate
 * @desc    Activate device (requires valid activation)
 * @access  Public
 */
router.post(
  '/activate',
  validateBody('deviceActivate'),
  deviceController.activate
);

// ==========================================
// PLAYLIST ROUTES (Protected by device auth)
// ==========================================

/**
 * @route   GET /device/playlists
 * @desc    Get all playlists for device
 * @access  Private (device token required)
 */
router.get(
  '/playlists',
  authenticateDevice,
  playlistController.getPlaylists
);

/**
 * @route   POST /device/playlists/add
 * @desc    Add a new playlist
 * @access  Private (device token required)
 */
router.post(
  '/playlists/add',
  authenticateDevice,
  validateBody('playlistAdd'),
  playlistController.addPlaylist
);

/**
 * @route   PUT /device/playlists/:id
 * @desc    Update a playlist
 * @access  Private (device token required)
 */
router.put(
  '/playlists/:id',
  authenticateDevice,
  validateParams('uuidParam'),
  validateBody('playlistUpdate'),
  playlistController.updatePlaylist
);

/**
 * @route   DELETE /device/playlists/:id
 * @desc    Delete a playlist
 * @access  Private (device token required)
 */
router.delete(
  '/playlists/:id',
  authenticateDevice,
  validateParams('uuidParam'),
  playlistController.deletePlaylist
);

module.exports = router;
