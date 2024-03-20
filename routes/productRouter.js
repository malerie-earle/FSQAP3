// Imports
const express = require('express');
const router = express.Router();
const pool = require('../services/pg.auth_db');

// GET - Read
// All products - api/products
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.render('index', { products: result.rows });
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).send('Error');
  }
});

// All products - api/products
router.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.render('api/products', { content: 'partials/products', products: result.rows });
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).send('Error');
  }
// });

// // search for a product - api/products/:id
// router.get('/api/products/:product_id', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT * FROM products WHERE product_id = $1', [req.params.id]);
//     res.json('/api/products/:product_id', { product: result.rows });
//   } catch (err) {
//     console.error('Error executing query', err);
//     res.status(500).send('Error');
//   }
// });

// // search for a product - api/products/:name
// router.get('/api/products/:product_name', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT * FROM products WHERE product_name = $1', [req.params.product_name]);
//     res.json('api/products/:product_name', { product: result.rows });
//   } catch (err) {
//     console.error('Error executing query', err);
//     res.status(500).send('Error');
//   }
// });

// // Filter products by category
// router.get('/api/products/category/:product_category', async (req, res) => {
//   try {
//     const categories = ['Arts & Crafts', 'Bath & Body', 'Books', 'Clothing & Apparel', 'Collectible Pins', 'Fine Art', 'Food & Drink', 'Garden', 'Handmade', 'Merchandise', 'Seasonal'];
//     const result = await pool.query('SELECT * FROM products WHERE product_category = $1', [req.params.product_category]);
//     res.render('index', { categories, products: result.rows });
//   } catch (err) {
//     console.error('Error executing query', err);
//     res.status(500).send('Error');
//   }
// });
// // search for a product - api/products/:product_price ascending
// router.get('/api/products/:price', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT * FROM products ORDER BY price ASC');
//     res.render('api/products/:price', { product: result.rows });
//   } catch (err) {
//     console.error('Error executing query', err);
//     res.status(500).send('Error');
//   }
// });

// // search for a product - api/products/:product_price descending
// router.get('/api/products/:price', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT * FROM products ORDER BY product_price DESC');
//     res.render('api/products/:price', { product: result.rows });
//   } catch (err) {
//     console.error('Error executing query', err);
//     res.status(500).send('Error');
//   }
// });

// // POST - Create
// // Create a new product
// router.post('/api/newproduct', async (req, res) => {
//   try {
//     const { product_name, price, description, image, category_id } = req.body;
//     const result = await pool.query('INSERT INTO products (product_name, price, description, image, category_id) VALUES ($1, $2, $3) RETURNING *', [product_name, price, description, image, category_id]);
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server error');
//   }
// });

// // PUT - Update
// // Update a product
// router.put('/api/products/update', async (req, res) => {
//   try {
//     const { product_name, price, description, image, category_id } = req.body;
//     const result = await pool.query('UPDATE products SET product_name = $1, price = $2, description = $3, image = $4, category_id = $5 WHERE id = $6 RETURNING *', [product_name, price, description, image, category_id, req.params.id]);
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server error');
//   }
// });

// // DELETE - Delete
// // Delete a product
// router.delete('api/products/delete', async (req, res) => {
//   try {
//     const result = await pool.query('DELETE FROM products WHERE id = $1', [req.params.id]);
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server error');
//   }
// });
});
// Export
module.exports = router;