// Import Sequelize's DataTypes for defining model attributes
const { DataTypes } = require('sequelize');
// Import the database connection instance
const db = require("../common/connect");
// Import the Movie model to establish relationships
const Movie = require("./movie.model");

// Define the Category model with its attributes
const Category = db.define('Category', {
  cat_id: {
    type: DataTypes.INTEGER,        // Integer data type for category ID
    allowNull: false,               // ID cannot be null
    primaryKey: true,               // Set cat_id as the primary key
    autoIncrement: true,            // Automatically increment the ID
  },
  cat_name: { type: DataTypes.STRING },   // Category name (e.g., Action, Drama)
  cat_slug: { type: DataTypes.STRING },   // Slug for URLs (e.g., action, drama)
  status: { type: DataTypes.BOOLEAN }     // Status (e.g., active or inactive)
});

module.exports = Category;
