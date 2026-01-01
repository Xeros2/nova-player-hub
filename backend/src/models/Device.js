/**
 * Nova Player - Device Model
 * Represents a registered device in the system
 */

const { DataTypes } = require('sequelize');
const { DEVICE_STATUS } = require('../utils/constants');

module.exports = (sequelize) => {
  const Device = sequelize.define('Device', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    device_code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [4, 50]
      }
    },
    pin_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    status: {
      type: DataTypes.ENUM(...Object.values(DEVICE_STATUS)),
      defaultValue: DEVICE_STATUS.OPEN,
      allowNull: false
    },
    trial_started_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    trial_expires_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    activated_until: {
      type: DataTypes.DATE,
      allowNull: true
    },
    lifetime: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    reseller_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'resellers',
        key: 'id'
      }
    }
  }, {
    tableName: 'devices',
    indexes: [
      {
        unique: true,
        fields: ['device_code']
      },
      {
        fields: ['status']
      },
      {
        fields: ['reseller_id']
      },
      {
        fields: ['activated_until']
      }
    ]
  });

  // Instance method to check if device has used trial
  Device.prototype.hasUsedTrial = function() {
    return this.trial_started_at !== null;
  };

  // Instance method to check if trial is expired
  Device.prototype.isTrialExpired = function() {
    if (!this.trial_expires_at) return false;
    return new Date() > new Date(this.trial_expires_at);
  };

  // Instance method to check if activation is expired
  Device.prototype.isActivationExpired = function() {
    if (this.lifetime) return false;
    if (!this.activated_until) return true;
    return new Date() > new Date(this.activated_until);
  };

  return Device;
};
