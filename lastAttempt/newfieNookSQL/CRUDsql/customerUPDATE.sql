UPDATE customers SET first_name = $1, last_name = $2, email = $3, username = $4, password = $5, address = $6, payment_method = $7 WHERE id = $8 RETURNING *;
