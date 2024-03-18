// Imports
const express = require('express');
const router = express.Router();
const pool = require('../DAL/pg.auth.dal');


// GET - Read
// All customers - api/customers
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM customers');
    res.render('api/customers', { customers: result.rows });
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).send('Error');
  }
});

// search for a customer - api/customers/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM customers WHERE id = $1', [req.params.id]);
    res.render('api/customers/:id', { customer: result.rows });
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).send('Error');
  }
});

// search for a customer - api/customers/:first_name
router.get('api/customers/:first_name', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM customers WHERE first_name = $1', [req.params.first_name]);
    res.render('api/customers/:first_name', { customer: result.rows });
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).send('Error');
  }
});

// search for a customer - api/customers/:last_name
router.get('api/customers/:last_name', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM customers WHERE last_name = $1', [req.params.last_name]);
    res.render('api/customers/:last_name', { customer: result.rows });
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).send('Error');
  }
});

// search for a customer - api/customers/:first_name/:last_name
router.get('/api/customers/:first_name/:last_name/', async (req, res) => {
  try {
    const { first_name, last_name} = req.params;
    const fullName = first_name + ' ' + last_name;
    const result = await pool.query('SELECT * FROM customers WHERE (first_name || \' \' || last_name) = $1', [fullName]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// search for a customer = api/customers/:email
router.get('api/customers/:email', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM customers WHERE email = $1', [req.params.email]);
    res.render('api/customers/:email', { customer: result.rows });
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).send('Error');
  }
});

// POST - Create
// Create a new customer
router.post('/', async (req, res) => {
  try {
    const { first_name, last_name, email } = req.body;
    const result = await pool.query('INSERT INTO customers (first_name, last_name, email) VALUES ($1, $2, $3)', [first_name, last_name, email]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// PUT - Update
// Update a customer
router.put('/:id', async (req, res) => {
  try {
    const { first_name, last_name, email, username, password, address, payment_method } = req.body;
    const result = await pool.query('UPDATE customers SET first_name = $1, last_name = $2, email = $3 WHERE id = $4', [first_name, last_name, email, username, password, address, payment_method, req.params.id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// DELETE - Delete
// Delete a customer
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM customers WHERE id = $1', [req.params.id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Export
module.exports = router;