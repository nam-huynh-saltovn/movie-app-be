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

  // Function to check if tables have any data
  const checkTablesQuery = `
     SELECT (SELECT COUNT(*) FROM types) AS types_count,
            (SELECT COUNT(*) FROM years) AS years_count,
            (SELECT COUNT(*) FROM categories) AS categories_count,
            (SELECT COUNT(*) FROM countries) AS countries_count,
            (SELECT COUNT(*) FROM movies) AS movies_count,
            (SELECT COUNT(*) FROM actors) AS actors_count,
            (SELECT COUNT(*) FROM directors) AS directors_count,
            (SELECT COUNT(*) FROM episodes) AS episodes_count,
            (SELECT COUNT(*) FROM category_movie) AS category_movie_count,
            (SELECT COUNT(*) FROM country_movie) AS country_movie_count,
            (SELECT COUNT(*) FROM actor_movie) AS actor_movie_count,
            (SELECT COUNT(*) FROM director_movie) AS director_movie_count,
            (SELECT COUNT(*) FROM episode_movie) AS episode_movie_count;
  `;

  connection.query(checkTablesQuery, (err, results) => {
    if (err) {
      console.error('Error checking tables:', err);
      connection.end();
      return;
    }

    // Checking if all tables have 0 rows (no data)
    const noData = Object.values(results[0]).every(count => count === 0);
    
    if (noData) {
      console.log('No data in the main tables, proceeding with import...');

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
    }else {
      console.log('Data already exists in the tables. Skipping import.');
      connection.end();
    }
  });
}

importData();
