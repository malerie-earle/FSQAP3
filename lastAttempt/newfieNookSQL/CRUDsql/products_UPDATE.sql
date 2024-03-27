UPDATE products SET product_name = $1, price = $2, description = $3, image = $4, category_id = $5 WHERE id = $6 RETURNING *;
