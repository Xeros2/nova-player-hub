/**
 * Nova Player - Express Application
 * Main application configuration
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const routes = require('./routes');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');
const { generalLimiter } = require('./middlewares/rateLimiter');
const logger = require('./utils/logger');

// Create Express app
const app = express();

// ==========================================
// SECURITY MIDDLEWARE
// ==========================================

// Helmet for security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false
}));

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 hours
}));

// Trust proxy (for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// ==========================================
// PARSING MIDDLEWARE
// ==========================================

// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ==========================================
// LOGGING MIDDLEWARE
// ==========================================

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  
  // Log request
  logger.logRequest(req);
  
  // Log response on finish
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('Response sent', {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`
    });
  });
  
  next();
});

// ==========================================
// RATE LIMITING
// ==========================================

// Apply general rate limiting to all routes
app.use(generalLimiter);

// ==========================================
// ROUTES
// ==========================================

// Mount all routes
app.use('/', routes);

// ==========================================
// ERROR HANDLING
// ==========================================

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

module.exports = app;
