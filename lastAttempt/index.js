if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// Imports
const express = require('express');
const logger = require('./logEvents');
const methodOverride = require('method-override');
const path = require('path');

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
const customerRouter = require('./routes/customerRouter');
app.use('/', customerRouter);

// Error handling
app.use((req, res) => {
  res.status(404).render('404');
});
app.use((req, res) => {
  res.status(500).render('503');
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
