const dal = require('./pg.auth_db');
const logger = require('../logEvents');

// Get all customers
const getAllCustomers = async (req, res) => {
  logger.info('customers.pg.dal.getCustomers(): Getting all customers from the database.');
  const sql = 'SELECT customer_id, first_name, last_name, email, username, password, address, payment_method FROM public.customer ORDER BY customer_id DESC;';
  try {
    const result = await dal.query(sql);
    return result.rows;
  } catch (error) {
    logger.error('Error in getAllCustomers():', error);
    res.status(500).render('503');
  }
};

// Get a Customer by customer_id
async function getCustomerByCustomerId(customer_id) {
  logger.info('customers.pg.dal.getCustomerByCustomerId()');
  const sql = `SELECT customer_id, first_name, last_name, email, username, password, address, payment_method FROM public.customer WHERE customer_id = $1;`;
  try {
    const results = await dal.query(sql, [customer_id]);
    logger.info(`Fetched customer by customer_id: ${customer_id}`);
    return results.rows;
  } catch (error) {
      logger.error(error);
      throw error;
    }
  };
 
// Get a Customer by first_name
async function getCustomerByFirstName(first_name) {
  logger.info('customers.pg.dal.getCustomerByFirstName()');
  const sql = `SELECT customer_id, first_name, last_name, email, username, password, address, payment_method FROM public.customer WHERE first_name = $1;`;
  try {
    const results = await dal.query(sql, [first_name]);
    logger.info(`Fetched customer by first_name: ${first_name}`);
    return results.rows;
  } catch (error) {
    logger.error(error);
    throw error;
  };
};

// Get a Customer by last_name
async function getCustomerByLastName(last_name) {
  logger.info('customers.pg.dal.getCustomerByLastName()');
  const sql = `SELECT customer_id, first_name, last_name, email, username, password, address, payment_method FROM public.customer WHERE last_name = $1;`;
  try {
    const results = await dal.query(sql, [last_name]);
    logger.info(`Fetched customer by last_name: ${last_name}`);
    return results.rows;
  } catch (error) {
    logger.error(error);
    throw error;
  };
};

// Get a Customer by email
async function getCustomerByEmail(email) {
  logger.info('customers.pg.dal.getCustomerByEmail()');
  const sql = `SELECT customer_id, first_name, last_name, email, username, password, address, payment_method FROM public.customer WHERE email = $1;`;
  try {
    const results = await dal.query(sql, [email]);
    logger.info(`Fetched customer by email: ${email}`);
    return results.rows;
  } catch (error) {
    logger.error(error);
    throw error;
  };
};

// Get a Customer by username
async function getCustomerByUsername(username) {
  logger.info('customers.pg.dal.getCustomerByUsername()');
  const sql = `SELECT customer_id, first_name, last_name, email, username, password, address, payment_method FROM public.customer WHERE username = $1;`;
  try {
    const results = await dal.query(sql, [username]);
    logger.info(`Fetched customer by username: ${username}`);
    return results.rows;
  } catch (error) {
    logger.error(error);
    throw error;
  };
};

// Add a new Customer
async function addCustomer(first_name, last_name, email, username, password, address, payment_method) {
  // Fetch the last customer_id from the database
  const idQuery = 'SELECT MAX(customer_id) AS max_id FROM public.customer;';
  const lastIdResult = await dal.query(idQuery);
  // Increment the last customer_id by one
  const newCustomerId = lastIdResult.rows[0].max_id + 1;
  // Use the new customer_id in the INSERT query
  const sql = `INSERT INTO public.customer (customer_id, first_name, last_name, email, username, password, address, payment_method) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;`;
  const values = [newCustomerId, first_name, last_name, email, username, password, address, payment_method];
  const newCustomer = await dal.query(sql, values);
  return newCustomer.rows, newCustomerId, first_name, last_name, email, username, password, address, payment_method;
}

// Edit a Customer
async function editCustomer(customer_id, first_name, last_name, email, username, password, address, payment_method) {
  logger.info('customers.pg.dal.editCustomer()');
  const selectSql = 'SELECT * FROM public.customer WHERE customer_id = $1 OR first_name = $1 OR last_name = $1 OR email = $1 OR username = $1';
  const updateSql = 'UPDATE public.customer SET first_name = $2, last_name = $3, email = $4, username = $5, password = $6, address = $7, payment_method = $8 WHERE customer_id = $1 RETURNING *';
  try {
    const selectResult = await dal.query(selectSql, [customer_id]);
    if (selectResult.rows.length === 0) {
      throw new Error('Customer not found');
    }
    const updateResult = await dal.query(updateSql, [customer_id, first_name, last_name, email, username, password, address, payment_method]);
    logger.info(`Updated customer: ${JSON.stringify(updateResult.rows)}`);
    return updateResult.rows;
  } catch (error) {
    logger.error(error);
    throw error;
  }
}

// Delete a customer
async function deleteCustomer(customer_id) {
  logger.info('customers.pg.dal.deleteCustomer()');
  const sql = `DELETE FROM public.customer WHERE customer_id = $1;`;
  try {
    const results = await dal.query(sql, [customer_id]);
    logger.info(`Deleted customer with customer_id: ${customer_id}`);
    return results.rows;
  } catch (error) {
    logger.error(error);
    throw error;
  };
};

// Update password
router.patch('/customer/:id', async (req, res) => {
  const customerId = req.params.id;
  const updatedFields = req.body;
  try {
    const updatedCustomer = await partiallyUpdateCustomer(customerId, updatedFields);
    res.status(200).json(updatedCustomer);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = {
  getAllCustomers,
  addCustomer,
  editCustomer,
  deleteCustomer,
  getCustomerByCustomerId,
  getCustomerByFirstName,
  getCustomerByLastName,
  getCustomerByEmail,
  getCustomerByUsername
};