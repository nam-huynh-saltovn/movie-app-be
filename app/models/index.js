'use strict';
require('dotenv').config();

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

let sequelize;
// Check if the configuration uses an environment variable for the database connection string
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config); // Initialize Sequelize using environment variable
} else {
  // Initialize Sequelize using individual database configuration values
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Read all files in the current directory (i.e., models directory), filter to get only .js files except the current file
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    // Import each model file and initialize it with Sequelize
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model; // Store the model in the db object using the model's name as the key
  });

// If the model has an associate function, call it to define relationships between models
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Export Sequelize instance and all models
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.ROLES = ["user", "admin"];

module.exports = db;
