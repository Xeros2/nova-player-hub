/**
 * Nova Player - Reseller Model
 * Represents a reseller account
 */

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Reseller = sequelize.define('Reseller', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true
      }
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    credits: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'resellers',
    indexes: [
      {
        unique: true,
        fields: ['email']
      }
    ]
  });

  // Instance method to check if reseller has enough credits
  Reseller.prototype.hasCredits = function(amount = 1) {
    return this.credits >= amount;
  };

  // Instance method to deduct credits
  Reseller.prototype.deductCredits = async function(amount = 1) {
    if (!this.hasCredits(amount)) {
      throw new Error('Insufficient credits');
    }
    this.credits -= amount;
    await this.save();
    return this.credits;
  };

  // Instance method to add credits
  Reseller.prototype.addCredits = async function(amount) {
    this.credits += amount;
    await this.save();
    return this.credits;
  };

  return Reseller;
};
