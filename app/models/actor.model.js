'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Actor extends Model {
    static associate(models) {
      // add N-N relationship
      Actor.belongsToMany(models.Movie, { through: 'actor_movie', foreignKey: 'act_id', as: 'Movies' });
    }
  }

  // Initialize the Actor model
  Actor.init({
    act_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    act_name: { type: DataTypes.STRING },
    sort_order: { type: DataTypes.STRING },
    status: { type: DataTypes.BOOLEAN }
  }, {
    sequelize,
    modelName: 'Actor',
    tableName: 'actors',
    timestamps: true
  });

  return Actor;
};