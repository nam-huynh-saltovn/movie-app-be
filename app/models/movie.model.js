// Import Sequelize's DataTypes for defining model attributes
const { DataTypes } = require('sequelize');
// Import the database connection instance
const db = require("../common/connect");
// Import related models
const Type = require('./type.model');
const Year = require('./year.model');
const Episode = require('./episode.model');

// Define the Movie model with various attributes
const Movie = db.define("Movie", {
  mov_id: {
    type: DataTypes.INTEGER, 
    allowNull: false,
    primaryKey: true,       // Set mov_id as the primary key
    autoIncrement: true,    // Automatically increment the ID
  },
  mov_name: { type: DataTypes.STRING },          // Movie name
  mov_slug: { type: DataTypes.STRING },          // Slug for the movie URL
  ori_name: { type: DataTypes.STRING },          // Original name of the movie
  content: { type: DataTypes.STRING },           // Movie content/description
  poster_url: { type: DataTypes.STRING },        // URL for the movie poster
  thumb_url: { type: DataTypes.STRING },         // URL for thumbnail image
  time: { type: DataTypes.STRING },              // Movie duration
  episode_current: { type: DataTypes.STRING },   // Current episode number
  episode_total: { type: DataTypes.STRING },     // Total number of episodes
  quality: { type: DataTypes.STRING },           // Quality of the movie (e.g., HD, SD)
  lang: { type: DataTypes.STRING },              // Language of the movie (vietsub, eng,...)
  status: { type: DataTypes.BOOLEAN },           // Status (e.g., complited/ongoing)
  year_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Year,          // Reference the Year model
      key: 'id'             // Foreign key in the Year model
    }
  },
  type_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Type,          // Reference the Type model
      key: 'id'             // Foreign key in the Type model
    }
  }
}, {
  timestamps: true,          // Enable timestamps
  createdAt: 'createdAt',     // Custom name for created timestamp
  updatedAt: 'updatedAt'      // Custom name for updated timestamp
});

// Define associations between models
Year.hasMany(Movie, { foreignKey: 'year_id' });   // A year has many movies
Movie.belongsTo(Year, { foreignKey: 'year_id' }); // A movie belongs to a specific year

Type.hasMany(Movie, { foreignKey: 'type_id' });   // A type has many movies
Movie.belongsTo(Type, { foreignKey: 'type_id' }); // A movie belongs to a specific type

// Many-to-many relationship between Movie and Episode through a junction table
Episode.belongsToMany(Movie, { through: 'episode_movie', foreignKey: 'ep_id' });
Movie.belongsToMany(Episode, { through: 'episode_movie', foreignKey: 'mov_id' });

module.exports = Movie;
