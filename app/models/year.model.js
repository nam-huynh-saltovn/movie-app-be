// Import Sequelize's DataTypes for defining model attributes
const { DataTypes } = require('sequelize');
// Import the database connection instance
const db = require("../common/connect");

// Define the Year model with its attributes
const Year = db.define('Year', {
  year_id: {
    type: DataTypes.INTEGER,        // Integer data type for year ID
    allowNull: false,               // ID cannot be null
    primaryKey: true,               // Set year_id as the primary key
    autoIncrement: true,            // Automatically increment the ID
  },
  year_name: { type: DataTypes.INTEGER },   // Year name (e.g., 2021, 2022)
  status: { type: DataTypes.BOOLEAN }      // Status (e.g., active or inactive)
});


module.exports = Year;
