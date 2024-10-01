'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      // add N-N relationship
      Category.belongsToMany(models.Movie, { through: 'category_movie', foreignKey: 'cat_id', as: 'Movies' });
    }
  }

  // Initialize the Category model
  Category.init({
    cat_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    cat_name: { type: DataTypes.STRING },
    cat_slug: { type: DataTypes.STRING },
    status: { type: DataTypes.BOOLEAN }
  }, {
    sequelize,
    modelName: 'Category',
    tableName: 'categories',
    timestamps: true
  });

  return Category;
};