/**
 * Nova Player - Admin Routes
 * Routes for admin operations
 */

const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');
const { authenticateAdmin } = require('../middlewares/authMiddleware');
const { validateBody, validateQuery } = require('../middlewares/validator');
const { loginLimiter, adminLimiter } = require('../middlewares/rateLimiter');

/**
 * @route   POST /admin/login
 * @desc    Authenticate admin
 * @access  Public (rate limited)
 */
router.post(
  '/login',
  loginLimiter,
  validateBody('adminLogin'),
  adminController.login
);

// All routes below require admin authentication
router.use(authenticateAdmin);
router.use(adminLimiter);

/**
 * @route   GET /admin/stats
 * @desc    Get system statistics
 * @access  Private (admin only)
 */
router.get('/stats', adminController.getStats);

// ==========================================
// DEVICE MANAGEMENT
// ==========================================

/**
 * @route   GET /admin/devices
 * @desc    Get all devices with pagination
 * @access  Private (admin only)
 */
router.get(
  '/devices',
  validateQuery('pagination'),
  adminController.getDevices
);

/**
 * @route   POST /admin/device/activate
 * @desc    Activate a device
 * @access  Private (admin only)
 */
router.post(
  '/device/activate',
  validateBody('deviceActivate'),
  adminController.activateDevice
);

/**
 * @route   POST /admin/device/expire
 * @desc    Expire a device
 * @access  Private (admin only)
 */
router.post(
  '/device/expire',
  validateBody('deviceStatus'),
  adminController.expireDevice
);

/**
 * @route   POST /admin/device/start-trial
 * @desc    Start trial for a device
 * @access  Private (admin only)
 */
router.post(
  '/device/start-trial',
  validateBody('deviceStatus'),
  adminController.startDeviceTrial
);

// ==========================================
// BATCH OPERATIONS
// ==========================================

/**
 * @route   POST /admin/batch/start-trial
 * @desc    Start trial for multiple devices
 * @access  Private (admin only)
 */
router.post(
  '/batch/start-trial',
  validateBody('batchOperation'),
  adminController.batchStartTrial
);

/**
 * @route   POST /admin/batch/expire
 * @desc    Expire multiple devices
 * @access  Private (admin only)
 */
router.post(
  '/batch/expire',
  validateBody('batchOperation'),
  adminController.batchExpire
);

/**
 * @route   POST /admin/batch/activate
 * @desc    Activate multiple devices
 * @access  Private (admin only)
 */
router.post(
  '/batch/activate',
  validateBody('batchActivate'),
  adminController.batchActivate
);

/**
 * @route   POST /admin/batch/start-trial-all
 * @desc    Start trial for ALL OPEN devices
 * @access  Private (admin only)
 */
router.post(
  '/batch/start-trial-all',
  adminController.batchStartTrialAllOpen
);

/**
 * @route   POST /admin/batch/activate-lifetime
 * @desc    Activate multiple devices with lifetime
 * @access  Private (admin only)
 */
router.post(
  '/batch/activate-lifetime',
  validateBody('batchOperation'),
  adminController.batchActivateLifetime
);

// ==========================================
// RESELLER MANAGEMENT
// ==========================================

/**
 * @route   GET /admin/resellers
 * @desc    Get all resellers
 * @access  Private (admin only)
 */
router.get(
  '/resellers',
  validateQuery('pagination'),
  adminController.getResellers
);

/**
 * @route   POST /admin/reseller/create
 * @desc    Create a new reseller
 * @access  Private (admin only)
 */
router.post(
  '/reseller/create',
  validateBody('resellerCreate'),
  adminController.createReseller
);

/**
 * @route   POST /admin/reseller/credit
 * @desc    Add credits to a reseller
 * @access  Private (admin only)
 */
router.post(
  '/reseller/credit',
  validateBody('resellerCredits'),
  adminController.addResellerCredits
);

module.exports = router;
