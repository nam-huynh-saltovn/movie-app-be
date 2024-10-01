'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Country extends Model {
    static associate(models) {
      // add N-N relationship
      Country.belongsToMany(models.Movie, { through: 'country_movie', foreignKey: 'ctr_id', as: 'Movies' });
    }
  }

  // Initialize the Country model
  Country.init({
    ctr_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    ctr_name: { type: DataTypes.STRING },
    ctr_slug: { type: DataTypes.STRING },
    status: { type: DataTypes.BOOLEAN }
  }, {
    sequelize,
    modelName: 'Country',
    tableName: 'countries',
    timestamps: true
  });

  return Country;
};