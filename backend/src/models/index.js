/**
 * Nova Player - Database Models
 * Sequelize initialization and model associations
 */

const { Sequelize } = require('sequelize');
const logger = require('../utils/logger');

// Initialize Sequelize with database URL
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: process.env.DATABASE_URL?.startsWith('postgres') ? 'postgres' : 'mysql',
  logging: process.env.NODE_ENV === 'development' ? (msg) => logger.debug(msg) : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: true,
    underscored: true
  }
});

// Import models
const Device = require('./Device')(sequelize);
const Playlist = require('./Playlist')(sequelize);
const Reseller = require('./Reseller')(sequelize);

// Define associations
// Device has many Playlists
Device.hasMany(Playlist, {
  foreignKey: 'device_id',
  as: 'playlists',
  onDelete: 'CASCADE'
});

Playlist.belongsTo(Device, {
  foreignKey: 'device_id',
  as: 'device'
});

// Reseller has many Devices
Reseller.hasMany(Device, {
  foreignKey: 'reseller_id',
  as: 'devices',
  onDelete: 'SET NULL'
});

Device.belongsTo(Reseller, {
  foreignKey: 'reseller_id',
  as: 'reseller'
});

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established successfully');
    return true;
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
    return false;
  }
};

// Sync database (create tables if they don't exist)
const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force, alter: process.env.NODE_ENV === 'development' });
    logger.info('Database synchronized successfully');
    return true;
  } catch (error) {
    logger.error('Database synchronization failed:', error);
    return false;
  }
};

module.exports = {
  sequelize,
  Device,
  Playlist,
  Reseller,
  testConnection,
  syncDatabase
};
