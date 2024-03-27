const express = require('express');
const router = express.Router();
const { getAllCustomers, getCustomerByCustomerId, getCustomerByFirstName, getCustomerByLastName, getCustomerByEmail, getCustomerByUsername, addCustomer } = require('../services/pg.customers.dal.js');
const logger = require('../logEvents.js');
const app = express();

// Import the customer DAL
const dal = require('../services/pg.auth_db.js');
const { render } = require('ejs');

// List of All Available Routes
logger.info('customerRouter - API Endpoints:');
  logger.info('Route: GET/READ - Home Page - /');
  logger.info('Route: GET/READ - All Customer - /customers');
  logger.info('Route: GET/READ - Single Customer by ID - /customer/id/:id');
  logger.info('Route: GET/READ - Single Customer by First Name - /customer/first/:firstName');
  logger.info('Route: GET/READ - Single Customer by Last Name - /customer/last/:lastName');
  logger.info('Route: GET/READ - Single Customer by Email - /customer/email/:email');
  logger.info('Route: GET/READ - Single Customer by Username - /customer/username/:username');
  logger.info('Route: POST/CREATE - Add Customer - /customer/add'); 
  logger.info('Route: PUT/UPDATE - Edit Customer - /customer/edit');
  logger.info('Route: DELETE - Delete Customer - /customer/delete'); 


// Home Page
router.get('/', (req, res) => {
  logger.info('customerRouter: Rendering the Home Page.');
  res.render('index.ejs', { title: 'Home Page', name: 'Malerie'});
});

// GET All Customers
router.get('/customers/', async (req, res) => {
  logger.info('customerRouter: Getting all customers from the database.');
  try {
    const theCustomers = await getAllCustomers();
    logger.info('customerRouter: All customers retrieved successfully.');
    res.render('allCustomers.ejs', { theCustomers: theCustomers });
  } catch (error) {
    logger.error('customerRouter: Error getting all customers:', error);
    res.status(500).render('503');
  }
});

// GET - Search Customers - /customer/search/
router.get('/customer/id/?search=:id', async (req, res) => {
  logger.info('customerRouter: Rendering the Search Customers Page.');
  try {
    logger.info('customerRouter: Successfully loaded search page.');
    res.render('searchCustomers.ejs');
  } catch (error) {
    logger.error('Error getting search page', error);
    res.status(503).render('503');
  }
});

// GET - Customer by ID - /customer/:id
router.get('/customer/id/?search=:id', async (req, res) => {
  const id = req.params.id;
  logger.info(`customerRouter: Getting the customer by ID: ${id}`);
  try {
    const aCustomer = await getCustomerByCustomerId(id);
    logger.info(`Customer: ${JSON.stringify(aCustomer)}`);
    res.render('customer.ejs', { aCustomer });
  } catch (error) {
    logger.error('Error getting customer page', error);
    res.status(503).render('503');
  }
});

// GET - Read Customer by first_name - /customer/first_name/
router.get('/customer/first/:first_name/', async (req, res) => {
  const first_name = req.query.first_name;
  logger.info(`customerRouter: Getting the customer by first_name: ${first_name}`);
  try {
    const aCustomer = await getCustomerByFirstName(first_name);
    logger.info(`Customer: ${JSON.stringify(aCustomer)}`);
    res.render('customer.ejs', { aCustomer });
  } catch (error) {
    logger.error('Error getting customer page', error);
    res.status(503).render('503');
  }
});

// GET - Read Customer by last_name - /customer/last_name/
router.get('/customer/last/:last_name/', async (req, res) => {
  const last_name = req.query.last_name;
  logger.info(`customerRouter: Getting the customer by last_name: ${last_name}`);
  try {
    const aCustomer = await getCustomerByLastName(last_name);
    logger.info(`Customer: ${JSON.stringify(aCustomer)}`);
    res.render('customer.ejs', { aCustomer });
  } catch (error) {
    logger.error('Error getting customer page', error);
    res.status(503).render('503');
  }
});

// GET - Read Customer by email - /customer/email/
router.get('/customer/email/:email/', async (req, res) => {
  const email = req.query.email;
  logger.info(`customerRouter: Getting the customer by email: ${email}`);
    try {
      const aCustomer = await getCustomerByEmail(email);
      logger.info(`Customer: ${JSON.stringify(aCustomer)}`);
      res.render('customer.ejs', { aCustomer });
    } catch (error) {
      logger.error('Error getting customer page', error);
      res.status(503).render('503');
    }
});

// GET - Read Customer by username - /customer/username/
router.get('/customer/username/:username/', async (req, res) => {
  const username = req.query.username;
  logger.info(`customerRouter: Getting the customer by username: ${username}`);
    try {
      const aCustomer = await getCustomerByUsername(username);
      logger.info(`Customer: ${JSON.stringify(aCustomer)}`);
      res.render('customer.ejs', { aCustomer });
    } catch (error) {
      logger.error('Error getting customer page', error);
      res.status(503).render('503');
    }
});

// ADD a Customer
// Display the form for adding a customer
router.get('/customer/add/', (req, res) => {
  logger.info('customerRouter: Rendering the Add Customer Page.');
  res.render('addCustomer', { newCustomerId: null });
});
// Handle the form submission
router.post('/customer/add/', async (req, res) => {
  const { first_name, last_name, email, username, password, address, payment_method } = req.body;
  logger.info('customerRouter: Adding a new customer.');
  try {
    const newCustomerDetails = await addCustomer(first_name, last_name, email, username, password, address, payment_method);
    const newCustomerId = newCustomerDetails[0].customer_id;
    logger.info('customerRouter: New customer added successfully.');
    res.redirect(`/customer/`);
  } catch (error) {
    logger.error('customerRouter: Error adding a new customer:', error);
    res.status(500).render('503');
  }
});

// GET the Edit Customer Page
router.get('/customer/edit', async (req, res) => {
  try {
    const id = req.query.id; 
    if (!id) {
      res.redirect('/');
      return;
    }
    const customerQuery = 'SELECT * FROM public.customer WHERE customer_id = $1;';
    const customerResult = await dal.query(customerQuery, [id]);
    const customer = customerResult.rows[0];
    if (customer) {
      res.render('editCustomer', { customer: customer });
    } else {
      res.status(404).send('Customer not found');
    }
  } catch (error) {
    logger.error('customerRouter: Error getting customer details:', error);
    res.status(500).render('503');
  }
});
// POST the Edit Customer Page
router.post('/customer/edit/', async (req, res) => {
  const { customer_id } = req.body;
  try {
    const customer = await getCustomerByCustomerId(customer_id);
    res.redirect(`/customers?customer_id=${customer.customer_id}`);
  } catch (error) {
    logger.error('customerRouter: Error getting customer details:', error);
    res.status(500).render('503');
  }
});

// Delete Customer Page
router.post('/customer/delete', async (req, res) => {
  const id = req.body.id; // Get the ID from the request body
  try {
    const deleteQuery = 'DELETE FROM public.customer WHERE customer_id = $1;';
    await dal.query(deleteQuery, [id]);
    logger.info(`Deleted customer with ID: ${id} successfully.`);
    res.redirect('/customers'); // Redirect to the customers page
  } catch (error) {
    logger.error('Error deleting customer:', error);
    res.status(500).render('503');
  }
});

module.exports = router;