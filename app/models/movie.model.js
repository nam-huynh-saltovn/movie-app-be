// Import Sequelize's DataTypes for defining model attributes
const { DataTypes } = require('sequelize');
// Import the database connection instance
const db = require("../common/connect");
// Import related models
const Type = require('./type.model');
const Year = require('./year.model');
const Category = require('./category.model');
const Country = require('./country.model');
const Actor = require('./actor.model');
const Director = require('./director.model');

// Define the Movie model with various attributes
const Movie = db.define("Movie", {
  mov_id: {
    type: DataTypes.INTEGER, 
    allowNull: false,
    primaryKey: true,       // Set mov_id as the primary key
    autoIncrement: true,    // Automatically increment the ID
  },
  mov_name: { type: DataTypes.STRING, },         // Name of the movie                    
  mov_slug: { type: DataTypes.STRING, },         // Slug of the movie
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

// Establish 1-N relationship
Year.hasMany(Movie, { foreignKey: 'year_id' });   // A year has many movies
Movie.belongsTo(Year, { foreignKey: 'year_id' }); // A movie belongs to a specific year

Type.hasMany(Movie, { foreignKey: 'type_id' });   // A type has many movies
Movie.belongsTo(Type, { foreignKey: 'type_id' }); // A movie belongs to a specific type

Movie.belongsToMany(Category, { through: 'category_movie', foreignKey: 'mov_id' });
Category.belongsToMany(Movie, { through: 'category_movie', foreignKey: 'cat_id' });

Movie.belongsToMany(Actor, { through: 'actor_movie', foreignKey: 'mov_id' });
Actor.belongsToMany(Movie, { through: 'actor_movie', foreignKey: 'act_id' });

Movie.belongsToMany(Director, { through: 'director_movie', foreignKey: 'mov_id' });
Director.belongsToMany(Movie, { through: 'director_movie', foreignKey: 'dir_id' });

Movie.belongsToMany(Country, { through: 'country_movie', foreignKey: 'mov_id' });
Country.belongsToMany(Movie, { through: 'country_movie', foreignKey: 'ctr_id' });

module.exports = Movie;
