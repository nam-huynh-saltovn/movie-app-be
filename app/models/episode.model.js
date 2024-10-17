'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Episode extends Model {
    static associate(models) {
      // add N-N relationship
      Episode.belongsTo(models.User, { foreignKey: 'user_id', as: 'Users' });

      Episode.belongsToMany(models.Movie, { through: 'episode_movie', foreignKey: 'ep_id', as: 'Movies' });
    }
  }

  // Initialize the Episode model
  Episode.init({
    ep_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    ep_title: { type: DataTypes.STRING(255) },
    ep_name: { type: DataTypes.STRING },
    ep_slug: { type: DataTypes.STRING },
    link_embed: { type: DataTypes.STRING },
    link_m3u8: { type: DataTypes.STRING },
    sort_order: { type: DataTypes.INTEGER },
    user_id: {
      type: DataTypes.INTEGER,
      references: { model: 'Users', key: 'user_id' }
    },
    status: { type: DataTypes.BOOLEAN }
  }, {
    sequelize,
    modelName: 'Episode',
    tableName: 'episodes',
    timestamps: true,
  });

  return Episode;
};

