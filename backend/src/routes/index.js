/**
 * Nova Player - Routes Index
 * Aggregates all route modules
 */

const express = require('express');
const router = express.Router();

const deviceRoutes = require('./deviceRoutes');
const resellerRoutes = require('./resellerRoutes');
const adminRoutes = require('./adminRoutes');

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Nova Player API is running',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API info endpoint
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Nova Player API',
    version: '1.0.0',
    documentation: '/docs',
    endpoints: {
      device: '/device',
      reseller: '/reseller',
      admin: '/admin'
    }
  });
});

// Mount route modules
router.use('/device', deviceRoutes);
router.use('/reseller', resellerRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
