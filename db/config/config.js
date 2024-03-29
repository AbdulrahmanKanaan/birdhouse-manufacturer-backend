/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();

module.exports = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  dialect: 'postgres',
  dialectOptions: {
    bigNumberStrings: true,
  },
};
