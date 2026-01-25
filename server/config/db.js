// A pool manages a collection of database connections,
// reusing them to avoid the overhead of opening and closing connections for every query.

const { Pool } = require('pg'); // importing Pool class from pg module
require('dotenv').config(); // Load environment variables from .env file

const pool = new Pool({ // Create a new Pool instance with configuration
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// A simple query function to reuse
const query = (text, params) => pool.query(text, params); // text: SQL query string, params: array of parameters for parameterized queries

module.exports = {
  query,
  pool, // Export the pool if you need it for transactions or more advanced queries
};