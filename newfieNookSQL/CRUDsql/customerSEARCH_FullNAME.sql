SELECT * FROM customers WHERE (first_name || ' ' || last_name) = $1;
