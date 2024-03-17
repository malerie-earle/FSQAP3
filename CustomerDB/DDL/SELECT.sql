-- Retrieve customers with a specific username and order them by last name
SELECT * FROM public."Customer"
WHERE last_name = 'Philps'
ORDER BY first_name;