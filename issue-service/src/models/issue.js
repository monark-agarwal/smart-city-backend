const { DataTypes } = require("sequelize");
const sequelize = require("../db/connection");

const Issue = sequelize.define("Issue", {

  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  status: {
    type: DataTypes.ENUM("Open", "In Progress", "Resolved", "Closed"),
    defaultValue: "Open",
  },

  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  latitude: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },

  longitude: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },

  imageUrls: {
    type: DataTypes.JSON,
  },

  resolutionNote: {
    type: DataTypes.TEXT,
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }

});

module.exports = Issue;
