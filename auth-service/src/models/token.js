const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection');

const Token = sequelize.define('Token', {
  token: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false
  }
});

module.exports = Token;