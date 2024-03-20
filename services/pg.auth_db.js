const Pool = require('pg').Pool
const pool = new Pool({
  user: 'malerie',
  host: 'localhost',
  database: 'newfieNook',
  password: 'password',
  port: 5050,
});

pool.connect((err) => {
  if (err) {
    console.error('Error connecting to the database', err);
  } else {
    console.log('Connected to the PostgreSQL database newfieNook!');
  }
});

module.exports = pool;