'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Director extends Model {
    static associate(models) {
      // add N-N relationship
      Director.belongsToMany(models.Movie, { through: 'director_movie', foreignKey: 'dir_id', as: 'Movies' });
    }
  }

  // Initialize the Director model
  Director.init({
    dir_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    dir_name: { type: DataTypes.STRING },
    status: { type: DataTypes.BOOLEAN }
  }, {
    sequelize,
    modelName: 'Director',
    tableName: 'directors',
    timestamps: true,
  });

  return Director;
};
