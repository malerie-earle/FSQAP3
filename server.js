// Imports
const http = require('http');
const express = require('express');
const urlencoded = express.urlencoded;
const methodOverride = require('method-override');
const ejs = require('ejs');
const pg = require('pg');
const pool = require('./services/pg.auth.dal');

const app = express();
const port = 5051;

// App setup

logger.log('info', 'Server is starting');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use((err, req, res, next) => {
  logger.error(`An error occurred: ${err.message}`);
  res.status(500).send('Internal Server Error');
});


// Routes
app.get('/', (req, res) => {
  res.render('index.ejs', { name: 'Malerie'});
});

// anything that starts with /customers will go into this
const customerRouter = require('./routes/customerRouter');
app.use('/customers', customerRouter); 

// anything that starts with /api/products will go into this
const apiRouter = require('./routes/productRouter');
app.use('/api', apiRouter);

// anything that starts with /logins will go into this
const loginsRouter = require('./routes/loginRouter.js');
app.use('/logins', loginsRouter);

app.use((req, res) => {
  res.status(404).render('404');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})
