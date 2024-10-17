'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Movie extends Model {
    static associate(models) {
      // add 1-N relationships
      Movie.belongsTo(models.Year, { foreignKey: 'year_id', as: 'Year' });
      Movie.belongsTo(models.Type, { foreignKey: 'type_id', as: 'Type' });
      Movie.belongsTo(models.User, { foreignKey: 'user_id', as: 'User' });

      // add N-N relationships
      Movie.belongsToMany(models.Category, { through: 'category_movie', foreignKey: 'mov_id', as: 'Categories' });
      Movie.belongsToMany(models.Director, { through: 'director_movie', foreignKey: 'mov_id', as: 'Directors' });
      Movie.belongsToMany(models.Country, { through: 'country_movie', foreignKey: 'mov_id', as: 'Countries' });
      Movie.belongsToMany(models.Episode, { through: 'episode_movie', foreignKey: 'mov_id', as: 'Episodes' });
      Movie.belongsToMany(models.Actor, { through: 'actor_movie', foreignKey: 'mov_id', as: 'Actors' });
    }
  }

  // Initialize the Movie model
  Movie.init({
    mov_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    mov_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mov_slug: { type: DataTypes.STRING(255) },
    ori_name: { type: DataTypes.STRING(255) },
    content: { type: DataTypes.TEXT },
    poster_url: { type: DataTypes.STRING },
    thumb_url: { type: DataTypes.STRING },
    time: { type: DataTypes.STRING },
    episode_current: { type: DataTypes.STRING },
    episode_total: { type: DataTypes.STRING },
    quality: { type: DataTypes.STRING },
    lang: { type: DataTypes.STRING },
    status: { type: DataTypes.BOOLEAN },
    year_id: {
      type: DataTypes.INTEGER,
      references: { model: 'Years', key: 'year_id' }
    },
    type_id: {
      type: DataTypes.INTEGER,
      references: { model: 'Types', key: 'type_id' }
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: { model: 'Users', key: 'user_id' }
    }
  }, {
    sequelize,
    modelName: 'Movie',
    tableName: 'movies',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  });

  return Movie;
};