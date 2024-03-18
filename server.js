// Imports
const http = require('http');
const express = require('express');
const urlencoded = express.urlencoded;
const methodOverride = require('method-override');
const ejs = require('ejs');
const pg = require('pg');
const pool = require('./DAL/pg.auth.dal');

const app = express();
const port = 5051;

// App setup
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Routes
app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    const data = { title: 'Home' }
    res.render('index', { data: result.rows });
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).send('Error');
  }
});

// Server
const server = http.createServer(app);
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


