if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// Imports
const express = require('express');
const bodyParser = require('body-parser');
const { logger } = require('./logEvents');
const customerRouter = require('./routes/customerRouter');
const productRouter = require('./routes/productRouter');
const methodOverride = require('method-override');
const ejs = require('ejs');
<<<<<<< Updated upstream
const pg = require('pg');
const pool = require('./services/pg.auth.dal');

const app = express();
const port = 5051;
=======
const { getCustomers } = require('./services/pg.customers.dal');
>>>>>>> Stashed changes

// App setup
const app = express();
const PORT = process.env.PORT || 5051; 

// Middleware
app.set('view engine', 'ejs');
app.use(express.static('public'));  
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Routes
app.use('/', customerRouter);
app.use('/products', productRouter);

// Error handling middleware
app.use((error, req, res, next) => {
  logger.error(error.stack);  // Log error stack to the console
  res.status(500).send('Something went wrong!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
