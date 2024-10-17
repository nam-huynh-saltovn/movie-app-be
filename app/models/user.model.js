'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // add N-1 relationship
      User.hasMany(models.Movie, { foreignKey: 'user_id', as: 'Movies' });
      User.hasMany(models.Episode, { foreignKey: 'user_id', as: 'Episodes' });
      User.hasMany(models.Token, { foreignKey: 'user_id', as: 'Tokens' });

      // add N-N relationship
      User.belongsToMany(models.Role, { through: 'user_role', foreignKey: 'user_id', as: 'Roles' });
    }
  }

  // Initialize the Type model
  User.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: { type: DataTypes.STRING },
    user_name: { type: DataTypes.STRING },
    password: { type: DataTypes.STRING },
    status: { type: DataTypes.BOOLEAN }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
  });

  return User;
};