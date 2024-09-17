// Import Sequelize's DataTypes for defining model attributes
const { DataTypes } = require('sequelize');
// Import the database connection instance
const db = require("../common/connect");
// Import the Movie model to establish relationships later if needed
const Movie = require("./movie.model");

// Define the Episode model with its attributes
const Episode = db.define('Episode', {
  ep_id: {
    type: DataTypes.INTEGER,        // Integer data type for episode ID
    allowNull: false,               // ID cannot be null
    primaryKey: true,               // Set ep_id as the primary key
    autoIncrement: true,            // Automatically increment the ID
  },
  ep_title: { type: DataTypes.STRING },  // Episode title
  ep_name: { type: DataTypes.STRING },   // Episode name
  ep_slug: { type: DataTypes.STRING },   // Slug for URLs (e.g., episode-1)
  ep_link: { type: DataTypes.STRING },   // Link to the episode video or content
  sort_order: { type: DataTypes.INTEGER },   // Link to the episode video or content
  status: { type: DataTypes.BOOLEAN }    // Status (e.g., active or inactive)
});

// Establish N-N relationship
Episode.belongsToMany(Movie, { through: 'episode_movie', foreignKey: 'ep_id' });
Movie.belongsToMany(Episode, { through: 'episode_movie', foreignKey: 'mov_id' });

module.exports = Episode;
