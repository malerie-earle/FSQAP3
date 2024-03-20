const dal = require("./pg.auth_db");

//get all logins.
var getLogins = function() {
  if(DEBUG) console.log("logins.pg.dal.getLogins()");
  return new Promise(function(resolve, reject) {
    const sql = `SELECT customer_id AS customer_id, first_name, last_name, email, username, password, address, payment_method FROM public."customer" \
        ORDER BY customer_id DESC LIMIT 7;`
    dal.query(sql, [], (err, result) => {
      if (err) {
        // logging should go here
        if(DEBUG) console.log(err);
        reject(err);
      } else {
        resolve(result.rows);
      }
    }); 
  }); 
};

var getLoginByLoginId = function(customer_id) {
  if(DEBUG) console.log("logins.pg.dal.getLoginByLoginId()");
  return new Promise(function(resolve, reject) {
    const sql = `SELECT customer_id AS customer_id, first_name, last_name, email, username, password, address, payment_method FROM public."customer" WHERE customer_id = $1`;
    dal.query(sql, [id], (err, result) => {
      if (err) {
        // logging should go here
        if(DEBUG) console.log(err);
        reject(err);
      } else {
        resolve(result.rows);
      }
    }); 
  }); 
};

var addLogin = function(first_name, last_name, email, username, password, address, payment_method) {
  if(DEBUG) console.log("logins.pg.dal.addLogin()");
  return new Promise(function(resolve, reject) {
    const sql = `INSERT INTO public."customer"(first_name, last_name, email, username, password, address, payment_method) \
        VALUES ($1, $2, $3, $4, $5, $6, $7);`;
    dal.query(sql, [first_name, last_name, email, username, password, address, payment_method], (err, result) => {
      if (err) {
          if(DEBUG) console.log(err);
          reject(err);
        } else {
          resolve(result.rows);
        }
    }); 
  });
};

var patchLogin = function(first_name, last_name, email, username, password, address, payment_method) {
  if(DEBUG) console.log("logins.pg.dal.patchLogin()");
  return new Promise(function(resolve, reject) {
    const sql = `UPDATE public."customer" SET first_name as $2, last_name as $3, email as $4, username as $5, password as $6, address as $7, payment_method as $8 WHERE customer_id=$1;`;
    dal.query(sql, [customer_id, first_name, last_name, email, username, password, address, payment_method], (err, result) => {
      if (err) {
          reject(err);
        } else {
          resolve(result.rows);
        }
    }); 
  });
};

var deleteLogin = function(customer_id) {
  if(DEBUG) console.log("logins.pg.dal.deleteLogin()");
  return new Promise(function(resolve, reject) {
    const sql = `DELETE FROM public."customer" WHERE customer_id = $1;`;
    dal.query(sql, [id], (err, result) => {
      if (err) {
          reject(err);
        } else {
          resolve(result.rows);
        }
    }); 
  });
};

module.exports = {
  getLogins,
  getLoginByLoginId,
  addLogin,
  patchLogin,
  deleteLogin,
}