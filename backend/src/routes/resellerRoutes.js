/**
 * Nova Player - Reseller Routes
 * Routes for reseller operations
 */

const express = require('express');
const router = express.Router();

const resellerController = require('../controllers/resellerController');
const { authenticateReseller } = require('../middlewares/authMiddleware');
const { validateBody } = require('../middlewares/validator');
const { loginLimiter } = require('../middlewares/rateLimiter');

/**
 * @route   POST /reseller/login
 * @desc    Authenticate reseller
 * @access  Public (rate limited)
 */
router.post(
  '/login',
  loginLimiter,
  validateBody('resellerLogin'),
  resellerController.login
);

/**
 * @route   GET /reseller/profile
 * @desc    Get reseller profile
 * @access  Private (reseller token required)
 */
router.get(
  '/profile',
  authenticateReseller,
  resellerController.getProfile
);

/**
 * @route   POST /reseller/device/activate
 * @desc    Activate a device using credits
 * @access  Private (reseller token required)
 */
router.post(
  '/device/activate',
  authenticateReseller,
  validateBody('resellerActivate'),
  resellerController.activateDevice
);

/**
 * @route   POST /reseller/device/start-trial
 * @desc    Start trial for a device
 * @access  Private (reseller token required)
 */
router.post(
  '/device/start-trial',
  authenticateReseller,
  validateBody('deviceStatus'),
  resellerController.startDeviceTrial
);

module.exports = router;
