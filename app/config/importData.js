// importData.js
const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];

async function importData() {
  const connection = mysql.createConnection({
    host: config.host,
    user: config.username,
    password: config.password,
    database: config.database,
    charset: config.charset,
    multipleStatements: true,
  });

  try {
    const pathFile = path.join(__dirname, '../../data-mysql.sql');
    const sql = fs.readFileSync(pathFile, 'utf-8');

    connection.query(sql, (error, results) => {
      if (error) {
        console.error('Error import data:', error);
        return;
      }
      console.log('Data imported successfully:', results);
    });
  } catch (error) {
    console.error('Error importing data:', error);
  } finally {
    connection.end();
  }
}

importData();
