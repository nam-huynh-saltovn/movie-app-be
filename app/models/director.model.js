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
  ctr_name: { type: DataTypes.STRING },   // Director's name
  ctr_slug: { type: DataTypes.STRING },   // Slug for URLs (e.g., director-name)
  status: { type: DataTypes.BOOLEAN }     // Status (e.g., active or inactive)
});

// Define many-to-many relationship between Director and Movie models
Director.belongsToMany(Movie, { through: 'MovieDirectors' });   // Director can be related to many movies
Movie.belongsToMany(Director, { through: 'MovieDirectors' });   // Movie can have many directors


module.exports = Director;
