INSERT INTO customers (first_name, last_name, email, username, password, address, payment_method) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;
