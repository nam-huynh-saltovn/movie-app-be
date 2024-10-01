'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Type extends Model {
    static associate(models) {
      // add N-1 relationship
      Type.hasMany(models.Movie, { foreignKey: 'type_id', as: 'Movies' });
    }
  }

  // Initialize the Type model
  Type.init({
    type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    type_name: { type: DataTypes.STRING },
    type_slug: { type: DataTypes.STRING },
    status: { type: DataTypes.BOOLEAN }
  }, {
    sequelize,
    modelName: 'Type',
    tableName: 'types',
    timestamps: true,
  });

  return Type;
};