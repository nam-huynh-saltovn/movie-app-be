// Import Sequelize's DataTypes for defining model attributes
const { DataTypes } = require('sequelize');
// Import the database connection instance
const db = require("../common/connect");

// Define the Type model with its attributes
const Type = db.define('Type', {
  type_id: {
    type: DataTypes.INTEGER,        // Integer data type for type ID
    allowNull: false,               // ID cannot be null
    primaryKey: true,               // Set type_id as the primary key
    autoIncrement: true,            // Automatically increment the ID
  },
  type_name: { type: DataTypes.STRING },   // Type name
  type_slug: { type: DataTypes.STRING },   // Slug for URLs (e.g., series, single)
  status: { type: DataTypes.BOOLEAN }      // Status (e.g., active or inactive)
});


module.exports = Type;
