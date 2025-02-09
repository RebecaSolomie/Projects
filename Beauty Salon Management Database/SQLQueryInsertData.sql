INSERT INTO clients (client_id, first_name, last_name, phone, birthdate)
VALUES
(100, 'Cynthia', 'Doe', '0789123422', '1990-05-15'),
(101, 'Emily', 'Clark', '0755556781', '1985-12-10'),
(102, 'Chris', 'Brown', '0720369012', '1992-04-23'),
(103, 'Sarah', 'Davis', '0792323456', '1988-07-19'),
(104, 'Laura', 'Wilson', '0740997890', '1995-09-30'),
(105, 'Kylie', 'Evans', '0264336789', '1983-06-13'),
(106, 'Jessica', 'Alba', '0747112345', '1981-04-28'),
(107, 'Mark', 'Ruffalo', '0264781122', '1967-11-22'),
(108, 'Scarlet', 'Wolf', '0770903344', '1984-11-22'),
(109, 'Kim', 'Downey', '0220495566', '1965-04-04');


INSERT INTO stylists (stylist_id, first_name, last_name, specialty, hire_date, email)
VALUES
(200, 'Jane', 'Lee', 'Haircutting', '2020-01-15', 'jane.lee@beautysalon.com'),
(201, 'Anna', 'Johnson', 'Hair Coloring', '2019-03-11', 'anna.johnson@beautysalon.com'),
(202, 'David', 'Martinez', 'Facials', '2021-06-24', 'david.martinez@beautysalon.com'),
(203, 'Patricia', 'Garcia', 'Makeup', '2018-09-17', 'patricia.garcia@beautysalon.com'),
(204, 'Geany', 'Smith', 'Nail Art', '2022-02-02', 'geany.smith@beautysalon.com'),
(205, 'Sophia', 'Harris', 'Massage Therapy', '2021-05-12', 'sophia.harris@beautysalon.com'),
(206, 'Liam', 'Robinson', 'Hair Styling', '2019-09-10', 'liam.robinson@beautysalon.com'),
(207, 'Emma', 'White', 'Hair Coloring', '2020-11-05', 'emma.white@beautysalon.com'),
(208, 'Cassie', 'Walker', 'Makeup', '2022-01-20', 'cassie.walker@beautysalon.com'),
(209, 'Olivia', 'Lee', 'Manicure/Pedicure', '2018-08-15', 'olivia.lee@beautysalon.com');


INSERT INTO service_categories (category_id, category_name)
VALUES
(1, 'Hair Services'),
(2, 'Skincare Services'),
(3, 'Nail Services'),
(4, 'Makeup Services'),
(5, 'Body Treatments');


INSERT INTO services (service_id, service_name, category_id, price, duration)
VALUES
(901, 'Haircut', 1, 50.00, '00:30:00'),
(902, 'Hair Coloring', 1, 120.00, '02:00:00'),
(903, 'Facial Treatment', 2, 80.00, '01:30:00'),
(904, 'Manicure', 3, 35.00, '00:45:00'),
(905, 'Bridal Makeup', 4, 150.00, '01:00:00'),
(906, 'Massage Therapy', 5, 70.00, '01:00:00'),
(907, 'Hair Styling', 1, 100.00, '01:30:00'),
(908, 'Waxing', 2, 40.00, '00:45:00'),
(909, 'Pedicure', 3, 50.00, '01:00:00'),
(910, 'Body Scrub', 5, 90.00, '01:30:00');


INSERT INTO appointments (appointment_id, client_id, stylist_id, appointment_date, appointment_time, status)
VALUES
(501, 101, 200, '2024-11-23', '14:00:00', 'Scheduled'),
(502, 102, 202, '2024-12-25', '16:00:00', 'Scheduled'),
(503, 103, 207, '2024-09-20', '12:00:00', 'Completed'),
(504, 100, 200, '2024-10-22', '09:30:00', 'Scheduled'),
(505, 105, 208, '2024-10-26', '11:00:00', 'Cancelled'),
(506, 102, 204, '2024-10-23', '15:00:00', 'Scheduled'),
(507, 107, 204, '2024-10-24', '10:30:00', 'Scheduled'),
(508, 108, 209, '2024-10-25', '14:00:00', 'Completed'),
(509, 109, 203, '2024-10-26', '12:00:00', 'Scheduled'),
(510, 100, 201, '2024-10-27', '16:30:00', 'Cancelled');


INSERT INTO appointment_services (appointment_id, service_id)
VALUES
(501, 901),  -- Appointment 501 includes Haircut
(501, 907),	 -- Appointment 501 includes Hair Styling
(502, 903),  -- Appointment 502 includes Facial Treatment
(503, 902),  -- Appointment 503 includes Hair Coloring
(504, 906),  -- Appointment 504 includes Massage Therapy
(505, 905),  -- Appointment 505 includes Bridal Makeup
(506, 904),  -- Appointment 506 includes Manicure
(507, 905),  -- Appointment 507 includes Bridal Makeup
(508, 909),  -- Appointment 508 includes Pedicure
(509, 908),  -- Appointment 509 includes Waxing
(510, 902); -- Appointment 510 includes Hair Coloring


INSERT INTO promotions (promotion_id, promotion_name, discount_percentage, start_date, end_date)
VALUES
(10, 'Autumn Sale', 15.00, '2024-10-01', '2024-10-31'),
(11, 'Holiday Discount', 10.00, '2024-12-01', '2024-12-31'),
(12, 'New Year Special', 20.00, '2025-01-01', '2025-01-15'),
(13, 'Weekend Special', 5.00, '2024-11-01', '2024-11-15'),
(14, 'VIP Customer Offer', 25.00, '2024-11-10', '2024-12-10');


INSERT INTO products (product_id, product_name, brand, price, stock_quantity, service_id, promotion_id)
VALUES
(1001, 'Shampoo', 'HairCarePlus', 15.00, 100, 901, 10),  -- Used for Haircut, Autumn Sale promotion
(1002, 'Hair Dye', 'ColorMagic', 45.00, 50, 902, 11),    -- Used for Hair Coloring, Holiday Discount promotion
(1003, 'Facial Cream', 'GlowSkin', 30.00, 40, 903, 12),  -- Used for Facial Treatment, New Year Special promotion
(1004, 'Nail Polish', 'GlossyNails', 10.00, 200, 904, 13), -- Used for Manicure, Weekend Special promotion
(1005, 'Makeup Kit', 'BridalBeauty', 60.00, 25, 905, 14), -- Used for Bridal Makeup, VIP Customer Offer promotion
(1006, 'Massage Oil', 'RelaxPro', 25.00, 70, 906, 13),  -- Used for Massage Therapy, Weekend Special promotion
(1007, 'Hair Gel', 'StylingMaster', 12.00, 90, 907, 10),  -- Used for Hair Styling, Autumn Sale promotion
(1008, 'Wax Strips', 'SmoothSkin', 15.00, 40, 908, 11),  -- Used for Waxing, Holiday Discount promotion
(1009, 'Pedicure Set', 'NailCare', 20.00, 60, 909, 14),  -- Used for Pedicure, VIP Customer Offer promotion
(1010, 'Body Scrub Cream', 'SoftCare', 35.00, 80, 910, 12);  -- Used for Body Scrub, New Year Special promotion


INSERT INTO inventory (inventory_id, product_id, quantity, reorder_level)
VALUES
(1, 1001, 100, 20),  -- Shampoo
(2, 1002, 50, 10),   -- Hair Dye
(3, 1003, 40, 5),    -- Facial Cream
(4, 1004, 200, 50),  -- Nail Polish
(5, 1005, 25, 5),    -- Makeup Kit
(6, 1006, 70, 10),   -- Massage Oil
(7, 1007, 90, 15),   -- Hair Gel
(8, 1008, 40, 8),    -- Wax Strips
(9, 1009, 60, 10),   -- Pedicure Set
(10, 1010, 80, 15);	 -- Body Scrub Cream


INSERT INTO payments (appointment_id, payment_date, payment_amount, payment_method)
VALUES
(503, '2024-09-20', 120.00, 'Credit Card'),  -- Payment for Hair Coloring (Completed)
(508, '2024-10-25', 50.00, 'Credit Card');   -- Payment for Pedicure (Completed)
