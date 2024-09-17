// Import Sequelize's DataTypes for defining model attributes
const { DataTypes } = require('sequelize');
// Import the database connection instance
const db = require("../common/connect");
// Import the Movie model to establish relationships
const Movie = require("./movie.model");

// Define the Actor model with its attributes
const Actor = db.define('Actor', {
  act_id: {
    type: DataTypes.INTEGER,        // Integer data type for actor ID
    allowNull: false,               // ID cannot be null
    primaryKey: true,               // Set act_id as the primary key
    autoIncrement: true,            // Automatically increment the ID
  },
  act_name: { type: DataTypes.STRING },  // Actor's name
  sort_order: { type: DataTypes.STRING }, // Order for sorting (optional, e.g., 'A-Z')
  status: { type: DataTypes.BOOLEAN }     // Status (e.g., active or inactive)
});

module.exports = Actor;
