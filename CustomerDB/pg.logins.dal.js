require('dotenv').config();

const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'customerdb',
  password: 'password',
  port: 5050,
});
  
  if(DEBUG) console.log("connected to PostgreSQL...");
  
  module.exports = pool;
