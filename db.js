const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const json = require('json');

app.get('/', (req, res) => {
  res.send('Hello World');
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});


// GET - Read

// All customers
app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Customer');
    res.render('index', { customers: result.rows });
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).send('Error');
  }
});

// All products - api/products
app.get('api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.render('api/products', { products: result.rows });
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).send('Error');
  }
});

// search for a product - api/products/:id
app.get('api/products/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    res.render('api/products/:id', { product: result.rows });
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).send('Error');
  }
});

// search for a product - api/products/:name
app.get('api/products/:product_name', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE product_name = $1', [req.params.product_name]);
    res.render('api/products/:product_name', { product: result.rows });
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).send('Error');
  }
});

// search for a product - api/products/:product_category
app.get('api/products/:product_category', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE product_category = $1 ORDER BY product_category ASC', [req.params.product_category]);
    res.render('api/products/:product_category', { product: result.rows });
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).send('Error');
  }
});

// search for a product - api/products/:product_price ascending
app.get('api/products/:product_price', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY product_price ASC');
    res.render('api/products/:product_price', { product: result.rows });
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).send('Error');
  }
});

// search for a product - api/products/:product_price descending
app.get('api/products/:product_price', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY product_price DESC');
    res.render('api/products/:product_price', { product: result.rows });
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).send('Error');
  }
});

// All customers - api/customers
app.get('api/customers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM customers');
    res.render('api/customers', { customers: result.rows });
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).send('Error');
  }
});

// search for a customer - api/customers/:id
app.get('api/customers/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM customers WHERE id = $1', [req.params.id]);
    res.render('api/customers/:id', { customer: result.rows });
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).send('Error');
  }
});

// search for a customer - api/customers/:first_name
app.get('api/customers/:first_name', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM customers WHERE first_name = $1', [req.params.first_name]);
    res.render('api/customers/:first_name', { customer: result.rows });
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).send('Error');
  }
});

// search for a customer - api/customers/:last_name
app.get('api/customers/:last_name', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM customers WHERE last_name = $1', [req.params.last_name]);
    res.render('api/customers/:last_name', { customer: result.rows });
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).send('Error');
  }
});

// search for a customer - api/customers/:first_name/:last_name
app.get('/api/customers/:first_name/:last_name/', async (req, res) => {
  try {
    const { first_name, last_name, email } = req.params;
    const fullName = first_name + ' ' + last_name;
    const result = await pool.query('SELECT * FROM customers WHERE (first_name || \' \' || last_name) = $1', [fullName]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// search for a customer - api/customers/:email
app.get('api/customers/:email', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM customers WHERE email = $1', [req.params.email]);
    res.render('api/customers/:email', { customer: result.rows });
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).send('Error');
  }
});

// POST - Create

// Create a new product
app.post('api/newproduct', async (req, res) => {
  try {
    const { product_name, price, description, image, category_id } = req.body;
    const result = await pool.query('INSERT INTO products (product_name, price, description, image, category_id) VALUES ($1, $2, $3) RETURNING *', [product_name, price, description, image, category_id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Create a new customer
app.post('api/signup', async (req, res) => {
  try {
    const { first_name, last_name, email, username, password, address, payment_method } = req.body;
    const result = await pool.query('INSERT INTO customers (first_name, last_name, email, username, password, address, payment_method) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', [first_name, last_name, email, username, password, address, payment_method]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// PUT - Update

// Update a product
app.put('api/products/update', async (req, res) => {
  try {
    const { product_name, price, description, image, category_id } = req.body;
    const result = await pool.query('UPDATE products SET product_name = $1, price = $2, description = $3, image = $4, category_id = $5 WHERE id = $6 RETURNING *', [product_name, price, description, image, category_id, req.params.id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Update a customer
app.put('api/customers/update', async (req, res) => {
  try {
    const { first_name, last_name, email, username, password, address, payment_method } = req.body;
    const result = await pool.query('UPDATE customers SET first_name = $1, last_name = $2, email = $3, username = $4, password = $5, address = $6, payment_method = $7 WHERE id = $8 RETURNING *', [first_name, last_name, email, username, password, address, payment_method, req.params.id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// DELETE - Delete

// Delete a product
app.delete('api/products/delete', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM products WHERE id = $1', [req.params.id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Delete a customer
app.delete('api/customers/delete', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM customers WHERE id = $1', [req.params.id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});
