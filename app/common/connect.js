const { Sequelize } = require('sequelize');

// Initialize a Sequelize instance to connect to database
const db = new Sequelize('movie_schema', 'root', '@huynhhoainam07112002', {
  host: 'localhost',
  dialect: 'mysql',
  pool: {
    max: 20,
    min: 0,
    acquire: 60000,
    idle: 10000
  }
});

// test connection
db.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });


module.exports = db;