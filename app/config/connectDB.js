const { Sequelize } = require('sequelize');
require('dotenv').config();

// Initialize a Sequelize instance to connect to database
const sequelize = new Sequelize(process.env.DB_PRO_DATABASE_NAME, process.env.DB_PRO_USER_NAME, process.env.DB_PRO_PASSWORD, 
  {
  host: process.env.DB_PRO_HOST,
  port: process.env.DB_PRO_PORT,
  dialect: process.env.DB_PRO_DIALECT,
  timezone: process.env.DB_TIMEZONE || "+07:00",
  pool: { 
    max: parseInt(process.env.DB_POOL_MAX) || 20,
    min: parseInt(process.env.DB_POOL_MIN) || 0,
    acquire: parseInt(process.env.DB_POOL_ACQUIRE) || 60000,
    idle: parseInt(process.env.DB_POOL_IDLE) || 10000 
  }
});

// test connection
let connectDB = async () => {
  try {
      await sequelize.authenticate();
      console.log('Connection has been established successfully.');
  } catch (error) {
      console.error('Unable to connect to the database:', error);
  }
}

module.exports = {connectDB, sequelize};