'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Year extends Model {
    static associate(models) {
      // add N-1 relationship
      Year.hasMany(models.Movie, { foreignKey: 'year_id', as: 'Movies' });
    }
  }

  // Initialize the Year model
  Year.init({
    year_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    year_name: { type: DataTypes.INTEGER },
    status: { type: DataTypes.BOOLEAN }
  }, {
    sequelize,
    modelName: 'Year',
    tableName: 'years',
    timestamps: true
  });

  return Year;
};