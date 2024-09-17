// Import Sequelize's DataTypes for defining model attributes
const { DataTypes } = require('sequelize');
// Import the database connection instance
const db = require("../common/connect");
// Import the Movie model to establish relationships
const Movie = require('./movie.model');

// Define the Director model with its attributes
const Director = db.define('Director', {
  dir_id: {
    type: DataTypes.INTEGER,        // Integer data type for director ID
    allowNull: false,               // ID cannot be null
    primaryKey: true,               // Set dir_id as the primary key
    autoIncrement: true,            // Automatically increment the ID
  },
  dir_name: { type: DataTypes.STRING },   // Director's name
  status: { type: DataTypes.BOOLEAN }     // Status (e.g., active or inactive)
});


module.exports = Director;
