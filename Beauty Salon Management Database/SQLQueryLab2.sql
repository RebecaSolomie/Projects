-- Insert data: at least one statement must violate referential integrity constraints;
INSERT INTO appointments (appointment_id, client_id, stylist_id, appointment_date, appointment_time, status)
VALUES (511, 999, 200, '2024-10-28', '15:00:00', 'Scheduled');



-- Update data for at least 3 tables;
-- decrease age for clients born after 1990 having phone number starting with 07
UPDATE clients
SET birthdate = DATEADD(YEAR, -10, birthdate)
WHERE birthdate > '1990-01-01' AND phone LIKE '07%';


-- change the email domain for stylists hired after 2020
UPDATE stylists
SET email = REPLACE(email, 'beautysalon.com', 'updatedsalon.com')
WHERE hire_date >= '2020-01-01';


-- apply a discount for all products that have more than 50 stock items and are used in services costing over 50$
UPDATE products
SET price = price * 0.9
WHERE stock_quantity > 50 AND service_id IN (
	SELECT service_id 
	FROM services 
	WHERE price > 50
);



-- Delete data for at least 2 tables;
-- delete cancelled appointments before october 2024
DELETE FROM appointments
WHERE status = 'Cancelled'
AND appointment_date < '2024-10-01';


-- delete products with price below 10$ or stock under 10 items
DELETE FROM products
WHERE product_id IN (
    SELECT DISTINCT product_id
    FROM products
    WHERE price < 10 OR stock_quantity < 10
);



-- a. 2 queries with the union operation; use UNION [ALL] and OR;
-- find all clients and stylists, showing their names and whether they are a "Client" or a "Stylist"
SELECT DISTINCT TOP 5 first_name, last_name, 'Client' AS person_type
FROM clients
UNION ALL
SELECT DISTINCT TOP 5 first_name, last_name, 'Stylist' AS person_type
FROM stylists
ORDER BY first_name;


-- find all appointments after 2024-10-26 with the status 'Cancelled' and the appointments with status 'Completed'
SELECT appointment_id, client_id, stylist_id, status
FROM appointments
WHERE status = 'Completed' OR (status = 'Cancelled' AND appointment_date > '2024-10-26');



-- b. 2 queries with the intersection operation; use INTERSECT and IN;
-- find clients who have both 'Scheduled' and 'Cancelled' appoitments
SELECT client_id
FROM appointments
WHERE status = 'Scheduled'
INTERSECT
SELECT client_id
FROM appointments
WHERE status = 'Cancelled';


-- find the details of the products that are in the 'Autumn Sale' or 'VIP Customer Offer'
SELECT product_id, product_name, brand, price
FROM products
WHERE promotion_id IN (
    SELECT promotion_id
    FROM promotions
    WHERE promotion_name = 'Autumn Sale' OR promotion_name = 'VIP Customer Offer'
);



-- c. 2 queries with the difference operation; use EXCEPT and NOT IN;
-- find all stylists who have 'Scheduled' appoitments but not 'Completed'
SELECT stylist_id
FROM appointments
WHERE status = 'Scheduled'
EXCEPT
SELECT stylist_id
FROM appointments
WHERE status = 'Completed';


-- find all products that are not part of 'Autumn Sale' promotion
SELECT product_id, product_name, brand, price
FROM products
WHERE promotion_id NOT IN (
	SELECT promotion_id
	FROM promotions
	WHERE promotion_name = 'Autumn Sale'
);



-- d. 4 queries with INNER JOIN, LEFT JOIN, RIGHT JOIN, and FULL JOIN (one query per operator); one query will join at least 3 tables, while another one will join at least two many-to-many relationships;
-- list appointment details including the client's name, stylist's name and the service provided in each appointment by joining the appointments, clients and stylists tables
SELECT a.appointment_id, c.first_name as client_first_name, c.last_name AS client_last_name,
	s.first_name AS stylist_first_name, s.last_name AS stylist_last_name,
	a.appointment_date
FROM appointments a
INNER JOIN clients c ON a.client_id = c.client_id
INNER JOIN stylists s ON a.stylist_id = s.stylist_id;


-- list all services even if there are no appointments associated with them and adds a discount
SELECT DISTINCT s.service_id, s.service_name, s.price, a.appointment_id, a.appointment_date, s.price * 0.9 AS discounted_price
FROM services s
LEFT JOIN appointment_services ap_s ON s.service_id = ap_s.service_id
LEFT JOIN appointments a ON ap_s.appointment_id = a.appointment_id
ORDER BY s.price DESC;


-- list all services and any appointments that have included those services ensuring that all services appear in the result even if they haven’t been booked
SELECT s.service_id, s.service_name, s.price, a.appointment_id, a.appointment_date
FROM services s
RIGHT JOIN appointment_services ap_s ON s.service_id = ap_s.service_id
RIGHT JOIN appointments a ON ap_s.appointment_id = a.appointment_id;


-- list all products with or without associated promotions and vice versa; the products table is connected to both services and promotions using many-to-many relationships
SELECT p.product_id, p.product_name, p.brand, p.price, promo.promotion_name, s.service_name
FROM products p
FULL JOIN promotions promo ON p.promotion_id = promo.promotion_id
FULL JOIN services s ON p.service_id = s.service_id;



-- e. 2 queries with the IN operator and a subquery in the WHERE clause; in at least one case, the subquery must include a subquery in its own WHERE clause;
-- find all clients who have appointments scheduled on a specific date (in this case 27.10.2024)
SELECT first_name, last_name, phone
FROM clients
WHERE client_id IN(
	SELECT client_id
	FROM appointments
	WHERE appointment_date = '2024-10-27'
);


-- find the names of the services that are offered at a price lower than the average price of all services
SELECT service_name, price
FROM services
WHERE service_id IN(
	SELECT service_id
	FROM services
	WHERE price < (
		SELECT AVG(price)
		FROM services
	)
);



-- f. 2 queries with the EXISTS operator and a subquery in the WHERE clause;
-- find the names of stylists who have completed at least one appointment
SELECT first_name, last_name
FROM stylists s
WHERE EXISTS(
	SELECT 1
	FROM appointments a
	WHERE a.stylist_id = s.stylist_id AND a.status = 'Completed'
);


-- find details of promotions that have been applied to at least one product currently in stock
SELECT promotion_name, discount_percentage, start_date, end_date
FROM promotions promo
WHERE EXISTS(
	SELECT 1
	FROM products p
	WHERE p.promotion_id = promo.promotion_id AND p.stock_quantity > 0
);



-- g. 2 queries with a subquery in the FROM clause;
-- find the average price of the services from each category
SELECT sc.category_name, avg_service_prices.avg_price
FROM service_categories sc
JOIN (
    SELECT category_id, AVG(price) AS avg_price
    FROM services
    GROUP BY category_id
) AS avg_service_prices ON sc.category_id = avg_service_prices.category_id;


-- find stylists with more than one appointment
SELECT s.stylist_id, s.first_name, s.last_name
FROM stylists s
JOIN (
	SELECT stylist_id, COUNT(*) AS appointment_count
	FROM appointments
	GROUP BY stylist_id
) AS sa ON s.stylist_id = sa.stylist_id
WHERE sa.appointment_count > 1;



-- h. 4 queries with the GROUP BY clause, 3 of which also contain the HAVING clause; 2 of the latter will also have a subquery in the HAVING clause; use the aggregation operators: COUNT, SUM, AVG, MIN, MAX;
-- find total number of appoitments per stylist
SELECT stylist_id, COUNT(*) AS total_appoitments
FROM appointments
GROUP BY stylist_id;


-- find services with an average price above 50$
SELECT category_id, AVG(price) AS average_price
FROM services
GROUP BY category_id
HAVING AVG(price) > 50;


-- find clients with total payment amount above the average for all clients
SELECT a.client_id, SUM(p.payment_amount) AS total_payment
FROM payments p
JOIN appointments a ON p.appointment_id = a.appointment_id
GROUP BY a.client_id
HAVING SUM(p.payment_amount) > (
	SELECT AVG(total_client_payment)
	FROM (
		SELECT a.client_id, SUM(p.payment_amount) AS total_client_payment
		FROM payments p
		JOIN appointments a ON p.appointment_id = a.appointment_id
		GROUP BY a.client_id
	) AS client_payment_totals
);


-- find service categories with total product stock below 100
SELECT sc.category_id, sc.category_name, SUM(p.stock_quantity) AS total_stock
FROM service_categories sc
JOIN services s ON sc.category_id = s.category_id
JOIN products p ON p.service_id = s.service_id
GROUP BY sc.category_id, sc.category_name
HAVING SUM(p.stock_quantity) < 100;



-- i. 4 queries using ANY and ALL to introduce a subquery in the WHERE clause (2 queries per operator); rewrite 2 of them with aggregation operators, and the other 2 with IN / [NOT] IN.
-- find clients with birthdates before the earliest stylist hire day
SELECT client_id, first_name, last_name, birthdate
FROM clients
WHERE birthdate < ANY (
	SELECT hire_date
	FROM stylists
);

SELECT client_id, first_name, last_name, birthdate
FROM clients
WHERE birthdate < (
    SELECT MIN(hire_date)
    FROM stylists
);


-- find services priced higher than any other service in the same category
SELECT service_id, service_name, price, category_id
FROM services s1
WHERE price > ALL (
	SELECT price
	FROM services s2
	WHERE s1.category_id = s2.category_id AND s1.service_id <> s2.service_id
);

SELECT service_id, service_name, price, category_id
FROM services s1
WHERE price > ALL (
    SELECT price
    FROM services s2
    WHERE s1.category_id = s2.category_id AND s1.service_id <> s2.service_id
) AND price NOT IN (
    SELECT price
    FROM services s2
    WHERE s1.category_id = s2.category_id AND s1.service_id <> s2.service_id
);



-- find promotions with a discount percentage greater than any product in any promotion
SELECT promotion_id, promotion_name, discount_percentage
FROM promotions
WHERE discount_percentage > ANY (
	SELECT price
	FROM products
	WHERE promotion_id IS NOT NULL
);

SELECT promotion_id, promotion_name, discount_percentage
FROM promotions
WHERE discount_percentage > (
    SELECT MIN(price)
    FROM products
    WHERE promotion_id IS NOT NULL
);


-- find appointments with payment amount greater than all scheduled appoitments
SELECT appointment_id, payment_amount
FROM payments
WHERE payment_amount > ALL (
	SELECT payment_amount
	FROM payments p
	JOIN appointments a ON p.appointment_id = a.appointment_id
	WHERE a.status = 'Scheduled'
);

SELECT appointment_id, payment_amount
FROM payments
WHERE payment_amount NOT IN (
	SELECT payment_amount
	FROM payments p
	JOIN appointments a ON p.appointment_id = a.appointment_id
	WHERE a.status = 'Scheduled'
);
