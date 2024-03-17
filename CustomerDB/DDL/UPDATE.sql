-- Update the first and last name of a customer with a specific email
UPDATE public."Customer"
SET first_name = 'Robert', last_name = 'Johnson'
WHERE email = 'epiaggia1h@ebay.co.uk';