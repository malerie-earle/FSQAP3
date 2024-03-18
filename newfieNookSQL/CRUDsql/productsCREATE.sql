INSERT INTO products (product_name, price, description, image, category_id) VALUES ($1, $2, $3) RETURNING *;
