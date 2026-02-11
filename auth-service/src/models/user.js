const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection');

const User = sequelize.define('User', {
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: false },

  email: { type: DataTypes.STRING, allowNull: false, unique: true },

  password: { type: DataTypes.STRING, allowNull: false },

  role: {
  type: DataTypes.ENUM('citizen', 'authority'),
  defaultValue: 'citizen'
},
  city: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = User;