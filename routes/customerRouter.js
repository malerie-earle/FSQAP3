// Imports
const express = require('express');
const router = express.Router();
const pool = require('../services/pg.auth_db');


// GET - Read
// All customers - api/customers
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM customer');
    res.render('api/customer', { customer: result.rows });
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).send('Error');
  }
});

// search for a customer - api/customers/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM customer WHERE id = $1', [req.params.id]);
    res.render('api/customer/:id', { customer: result.rows });
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).send('Error');
  }
});

// search for a customer - api/customers/:first_name
router.get('api/customer/:first_name', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM customer WHERE first_name = $1', [req.params.first_name]);
    res.render('api/customer/:first_name', { customer: result.rows });
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).send('Error');
  }
});

// search for a customer - api/customers/:last_name
router.get('api/customer/:last_name', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM customer WHERE last_name = $1', [req.params.last_name]);
    res.render('api/customer/:last_name', { customer: result.rows });
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).send('Error');
  }
});

// search for a customer - api/customers/:first_name/:last_name
router.get('/api/customer/:first_name/:last_name/', async (req, res) => {
  try {
    const { first_name, last_name} = req.params;
    const fullName = first_name + ' ' + last_name;
    const result = await pool.query('SELECT * FROM customer WHERE (first_name || \' \' || last_name) = $1', [fullName]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// search for a customer = api/customers/:email
router.get('api/customer/:email', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM customer WHERE email = $1', [req.params.email]);
    res.render('api/customer/:email', { customer: result.rows });
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).send('Error');
  }
});

// POST - Create
// Create a new customer
router.post('/new', async (req, res) => {
  try {
    const { first_name, last_name, email } = req.body;
    const result = await pool.query('INSERT INTO customer (first_name, last_name, email) VALUES ($1, $2, $3)', [first_name, last_name, email]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// PUT - Update
// Update a customer
router.put('/:id/update', async (req, res) => {
  try {
    const { first_name, last_name, email, username, password, address, payment_method } = req.body;
    const result = await pool.query('UPDATE customer SET first_name = $1, last_name = $2, email = $3 WHERE id = $4', [first_name, last_name, email, username, password, address, payment_method, req.params.id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// DELETE - Delete
// Delete a customer
router.delete('/:id/delete', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM customer WHERE id = $1', [req.params.id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

const loginsDal = require('../services/pg.logins.dal')

router.get('/', async (req, res) => {
  try {
    let theLogins = await loginsDal.getLogins(); 
     if(DEBUG) console.table(theLogins);
     res.render('logins', {theLogins});
 } catch {
     res.render('503');
 }
});

router.get('/:customer_id', async (req, res) => {
  try {
    let aLogin = await loginsDal.getLoginByLoginId(req.params.customer_id);
    if(DEBUG) console.table(aLogin);
    if (aLogin.length === 0)
      res.render('norecord')
    else
      res.render('login', {aLogin});
  } catch {
    res.render('503');
  }
});

router.get('/:id/edit', async (req, res) => {
  if(DEBUG) console.log('login.Edit : ' + req.params.id);
  res.render('loginPatch.ejs', {customer_id: req.params.customer_id, first_name: req.query.first_name, last_name: req.query.last_name, email: req.query.email, username: req.query.username, password: req.query.password, address: req.query.address, payment_method: req.query.payment_method});
});

router.post('/new', async (req, res) => {
  if(DEBUG) console.log('logins.Post');
  try {
    await loginsDal.addLogin(req.body.username, req.body.password, req.body.first_name, req.body.last_name, req.body.email, req.body.address, req.body.payment_method);
    res.redirect('/logins/');
  } catch (err) {
    if(DEBUG) console.log(err);
    res.render('503');
  }
});

router.patch('/:id/update', async (req, res) => {
  if(DEBUG) console.log('logins.PATCH: ' + req.params.customer_id);  
  try {
    await loginsDal.patchLogin(req.params.customer_id, req.body.first_name, req.body.last_name, req.body.email, req.body.username, req.body.password, req.body.address, req.body.payment_method);
    res.redirect('/logins/update');
  } catch{
    res.render('503');
  }
});

router.delete('/:id/delete', async (req, res) => {
  if(DEBUG) console.log('logins.DELETE: ' + req.params.customer_id);
  try {
    await loginsDal.deleteLogin(req.params.customer_id);
    res.redirect('/logins/delete');
  } catch {
    res.render('503');
  }
});

module.exports = router;