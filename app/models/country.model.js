// Import Sequelize's DataTypes for defining model attributes
const { DataTypes } = require('sequelize');
// Import the database connection instance
const db = require("../common/connect");
// Import the Movie model to establish relationships
const Movie = require("./movie.model");

// Define the Country model with its attributes
const Country = db.define('Country', {
  ctr_id: {
    type: DataTypes.INTEGER,        // Integer data type for country ID
    allowNull: false,               // ID cannot be null
    primaryKey: true,               // Set ctr_id as the primary key
    autoIncrement: true,            // Automatically increment the ID
  },
  ctr_name: { type: DataTypes.STRING },   // Country name (e.g., USA, UK)
  ctr_slug: { type: DataTypes.STRING },   // Slug for URLs (e.g., usa, uk)
  status: { type: DataTypes.BOOLEAN }     // Status (e.g., active or inactive)
});

// Define many-to-many relationship between Country and Movie models
Country.belongsToMany(Movie, { through: 'MovieCountries' });   // A country can be associated with many movies
Movie.belongsToMany(Country, { through: 'MovieCountries' });   // A movie can have many associated countries


module.exports = Country;
