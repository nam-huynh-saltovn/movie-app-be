// // Import Sequelize's DataTypes for defining model attributes
// const { Sequelize, DataTypes } = require('sequelize');
// const sequelize = new Sequelize('sqlite::memory:');

// // Define the Director model with its attributes
// const Director = sequelize.define('Director', {
//   dir_id: {
//     type: DataTypes.INTEGER,        // Integer data type for director ID
//     allowNull: false,               // ID cannot be null
//     primaryKey: true,               // Set dir_id as the primary key
//     autoIncrement: true,            // Automatically increment the ID
//   },
//   dir_name: { type: DataTypes.STRING },   // Director's name
//   status: { type: DataTypes.BOOLEAN }     // Status (e.g., active or inactive)
// });


// module.exports = Director;

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
