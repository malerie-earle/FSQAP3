// Imports
const express = require('express');
const router = express.Router();
const authDB = require('../services/pg.auth_db');
const loginsDal = require('../services/pg.logins.dal');
const bcrypt = require('bcrypt');
const logger = require('../logEvents');

// GET - Read: /logins/
// Route: /logins/
router.get('/', async (req, res) => {
  try {
    let theLogins = await loginsDal.getLogins(); 
     logger.table(theLogins);
     res.render('logins', {theLogins});
  } catch {
    logger.error('Error getting logins' + err);
    res.render('503');
 }
});

// GET - Read: /logins/:id
// Route: /logins/:id
router.get('/:id', async (req, res) => {
  try {
    let aLogin = await loginsDal.getLoginByLoginId(req.params.customer_id);
    if (aLogin.length === undefined || aLogin.length === 0) {
      logger.info('No record found');
      res.render('norecord')
    } else {
      logger.table(aLogin);
      res.render('login', {aLogin});
    }
  } catch (err) {
    logger.error('Error getting login by id' + err);
    res.render('503');
  }
});

// POST - Create: /logins/
// Route: /logins/new
router.post('/', async (req, res) => {
  logger.log('logins.Post');
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    logger.log('Hashed Password: ' + hashedPassword);
    let result = await loginsDal.addLogin(req.body.first_name, req.body.last_name, req.body.email, req.body.username, hashedPassword, req.body.address, req.body.payment_method);
    res.redirect('/logins/new');
  } catch (err) {
    logger.error('Error adding login' + err);
    res.render('503');
  }
});

// GET - Patch: /logins/:id/edit
// Route: /logins/:id/edit
router.get('/:id/edit', async (req, res) => {
  logger.log('login.Edit : ' + req.params.customer_id);
  res.render('loginPatch.ejs', {first_name: req.query.first_name, last_name: req.query.last_name, email: req.query.email, username: req.query.username, password: req.query.password, address: req.query.address, payment_method: req.query.payment_method, theId: req.params.customer_id});
});

// GET - Delete: /logins/:id/delete
// Route: /logins/:id/delete
router.get('/:id/delete', async (req, res) => {
  logger.log('login.Delete : ' + req.params.customer_id);
  res.render('loginDelete.ejs', {first_name: req.query.first_name, last_name: req.query.last_name, email: req.query.email, username: req.query.username, password: req.query.password, address: req.query.address, payment_method: req.query.payment_method, theId: req.params.customer_id});
});

// PATCH - Update: /logins/:id
// Route: /logins/:id
router.patch('/:id/update', async (req, res) => {
  logger.log('logins.PATCH: ' + req.params.customer_id);  
  try {
    logger.log('Patching login');
    await loginsDal.patchLogin(req.params.customer_id, req.body.first_name, req.body.last_name, req.body.email, req.body.username, req.body.password, req.body.address, req.body.payment_method);
    res.redirect('/logins/update');
  } catch{
    logger.log('Error patching login');
    res.render('503');
  }
});

// DELETE - Delete: /logins/:id
// Route: /logins/:id
router.delete('/:id/delete', async (req, res) => {
  logger.log('logins.DELETE: ' + req.params.customer_id);
  try {
    logger.log('Deleting login');
    await loginsDal.deleteLogin(req.params.customer_id);
    res.redirect('/logins/delete');
  } catch {
    logger.log('Error deleting login');
    res.render('503');
  }
});

module.exports = router;