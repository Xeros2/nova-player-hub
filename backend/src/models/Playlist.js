/**
 * Nova Player - Playlist Model
 * Represents a playlist associated with a device
 */

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Playlist = sequelize.define('Playlist', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    device_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'devices',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 100]
      }
    },
    url: {
      type: DataTypes.STRING(2048),
      allowNull: false,
      validate: {
        notEmpty: true,
        isUrl: true
      }
    }
  }, {
    tableName: 'playlists',
    indexes: [
      {
        fields: ['device_id']
      }
    ]
  });

  return Playlist;
};
