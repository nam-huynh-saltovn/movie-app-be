'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      // add N-N relationship
      Role.belongsToMany(models.User, { through: 'user_role', foreignKey: 'role_id', as: 'Users' });
    }
  }

  // Initialize the Type model
  Role.init({
        role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        },
        role_name: { type: DataTypes.STRING },
        status: { type: DataTypes.BOOLEAN }
    }, {
        sequelize,
        modelName: 'Role',
        tableName: 'roles',
        timestamps: true,
    });

  return Role;
};