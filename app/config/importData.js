// importData.js
const fs = require('fs');
const { Sequelize } = require('sequelize');
require('dotenv').config();

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];

const sequelize = new Sequelize(config.database, config.username, config.password,
  {
    host: config.host,
    dialect: config.dialect,
  }
);

async function importData() {
  try {
    const sql = fs.readFileSync('../../data-mysql.sql', 'utf-8');
    await sequelize.query(sql);
    console.log('Data imported successfully!');
  } catch (error) {
    console.error('Error importing data:', error);
  } finally {
    await sequelize.close();
  }
}

importData();
