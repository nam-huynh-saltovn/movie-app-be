'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Token extends Model {
    static associate(models) {
      // add N-1 relationship
      Token.belongsTo(models.User, { foreignKey: 'user_id', as: 'Users' });
    }
  }

  // Initialize the Type model
  Token.init({
        token_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        access_token: { type: DataTypes.STRING },
        refresh_token: { type: DataTypes.STRING },
        expired: { type: DataTypes.BOOLEAN },
        invoked: { type: DataTypes.BOOLEAN },
        acc_token_date: { type: DataTypes.DATE },
        ref_token_date: { type: DataTypes.DATE },
        user_id: {
            type: DataTypes.INTEGER,
            references: { model: 'Users', key: 'user_id' }
        },
        status: { type: DataTypes.BOOLEAN }
    }, {
        sequelize,
        modelName: 'Token',
        tableName: 'tokens',
        timestamps: true,
    });

  return Token;
};