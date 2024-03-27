const express = require('express');
const router = express.Router();
const pool = require('../services/pg.auth_db');
const { logger } = require('../logEvents.js');
const { getCustomers, getCustomerByCustomerId, getCustomerByFirstName, getCustomerByLastName, getCustomerByEmail, getCustomerByUsername, addCustomer, editCustomer, deleteCustomer } = require('../services/pg.customers.dal');
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const app = express();
const PORT = process.env.PORT || 5051;

// List of routes
console.log('Customer Routes: '); {
  console.log('ROUTE: /');
  console.log('ROUTE: /customers/');
  console.log('ROUTE: /customer/search');
  console.log('ROUTE: /customer/id/');
  console.log('ROUTE: /customer/first_name/');
  console.log('ROUTE: /customer/last_name/');
  console.log('ROUTE: /customer/first_name/last_name/');
  console.log('ROUTE: /customer/email/');
  console.log('ROUTE: /customer/username/');
  console.log('ROUTE: /customer/new/');
  console.log('ROUTE: /customer/edit/');
  console.log('ROUTE: /customer/delete/');
};

// GET - Read: Home Page - /
router.get('/', (req, res) => {
  res.render('index.ejs', { title: 'Home Page', name: 'Malerie' });
});

// GET - Read All Customers - /customers/
router.get('/customers/', async (req, res) => {
  try {
    const theCustomers = await getCustomers();
    logger.info(`Customers: ${JSON.stringify(theCustomers)}`);
    res.render('customers.ejs', { title: 'Customers', theCustomers });
  } catch (error) {
    logger.error('Error getting customers page', error);
    res.status(503).render('503');
  }
});

// GET - Search Customers - /search/
router.get('/customer/search/', async (req, res) => {
  try {
    res.render('searchCustomers.ejs');
  } catch (error) {
    logger.error('Error getting search page', error);
    res.status(503).render('503');
  }
});

// GET - Read Customer by customer_id - /customer/:id
router.get('/customer/id/', async (req, res) => {
  const searchTerm = req.query.search;
  if (searchTerm) {
  try {
    const aCustomer = await getCustomerByCustomerId(searchTerm);
    logger.info(`Customer: ${JSON.stringify(aCustomer)}`);
    res.render('customer.ejs', { aCustomer });
  } catch (error) {
    logger.error('Error getting customer page', error);
    res.status(503).render('503');
  }
 } else {
    res.render('norecord.ejs');
  }  
 }
);

// GET - Read Customer by first_name - /customer/first_name/
router.get('/customer/first_name/', async (req, res) => {
  const searchTerm = req.query.search;
  if (searchTerm) {
  try {
    const aCustomer = await getCustomerByFirstName(searchTerm);
    logger.info(`Customer: ${JSON.stringify(aCustomer)}`);
    res.render('customer.ejs', { aCustomer });
  } catch (error) {
    logger.error('Error getting customer page', error);
    res.status(503).render('503');
  }
 } else {
    res.render('norecord.ejs');
  }  
 }
);

// GET - Read Customer by last_name - /customer/last_name/
router.get('/customer/last_name/', async (req, res) => {
  const searchTerm = req.query.search;
  if (searchTerm) {
  try {
    const aCustomer = await getCustomerByLastName(searchTerm);
    logger.info(`Customer: ${JSON.stringify(aCustomer)}`);
    res.render('customer.ejs', { aCustomer });
  } catch (error) {
    logger.error('Error getting customer page', error);
    res.status(503).render('503');
  }
 } else {
    res.render('norecord.ejs');
  }  
 }
);

// GET - Read Customer by email - /customer/email/
router.get('/customer/email/', async (req, res) => {
  const searchTerm = req.query.search;
  if (searchTerm) {
  try {
    const aCustomer = await getCustomerByEmail(searchTerm);
    logger.info(`Customer: ${JSON.stringify(aCustomer)}`);
    res.render('customer.ejs', { aCustomer });
  } catch (error) {
    logger.error('Error getting customer page', error);
    res.status(503).render('503');
  }
 } else {
    res.render('norecord.ejs');
  }  
 }
);

// GET - Read Customer by username - /customer/username/
router.get('/customer/username/', async (req, res) => {
  const searchTerm = req.query.search;
  if (searchTerm) {
  try {
    const aCustomer = await getCustomerByUsername(searchTerm);
    logger.info(`Customer: ${JSON.stringify(aCustomer)}`);
    res.render('customer.ejs', { aCustomer });
  } catch (error) {
    logger.error('Error getting customer page', error);
    res.status(503).render('503');
  }
 } else {
    res.render('norecord.ejs');
  }  
 }
);

// GET - Display the form to create a new customer
router.get('/customer/new/', (req, res) => {
  res.render('addCustomer.ejs');
});

// POST - CREATE a new Customer
router.post('/customer/new/', async (req, res) => {
  const { first_name, last_name, email, username, password, address, payment_method } = req.body;
  try {
    const newCustomer = await addCustomer(first_name, last_name, email, username, password, address, payment_method);
    logger.info(`New Customer: ${JSON.stringify(newCustomer)}`);
    res.redirect('/customers/');  // Redirect to the list of customers
  } catch (error) {
    logger.error('Error creating new customer', error);
    res.status(503).render('503');
  }
});

// GET - Display the form to edit a customer
router.get('/customer/edit/', async (req, res) => {
  res.render('editCustomer.ejs');
});



module.exports = 
  router;