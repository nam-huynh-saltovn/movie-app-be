require('dotenv').config();
module.exports = {
  "development": {
    "username": process.env.DB_DEV_USER_NAME,
    "password": process.env.DB_DEV_PASSWORD,
    "database": process.env.DB_DEV_DATABASE_NAME,
    "host":     process.env.DB_DEV_HOST,
    "port":     process.env.DB_DEV_PORT,
    "dialect":  process.env.DB_DEV_DIALECT,
    "timezone": process.env.DB_TIMEZONE,
    "charset": process.env.DB_DEV_CHARSET
  },
  "test": {
    "username": process.env.DB_TEST_USER_NAME,
    "password": process.env.DB_TEST_PASSWORD,
    "database": process.env.DB_TEST_DATABASE_NAME,
    "host":     process.env.DB_TEST_HOST,
    "dialect":  process.env.DB_TEST_DIALECT,
  },
  "production": {
    "username": process.env.DB_PRO_USER_NAME,
    "password": process.env.DB_PRO_PASSWORD,
    "database": process.env.DB_PRO_DATABASE_NAME,
    "host":     process.env.DB_PRO_HOST,
    "port":     process.env.DB_PRO_PORT,
    "dialect":  process.env.DB_PRO_DIALECT,
    "timezone": process.env.DB_TIMEZONE,
    "charset": process.env.DB_PRO_CHARSET
  },
};
