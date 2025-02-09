
DROP TABLE IF EXISTS appointment_services;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS promotions;
DROP TABLE IF EXISTS inventory;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS appointments;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS service_categories;
DROP TABLE IF EXISTS stylists;
DROP TABLE IF EXISTS clients;


-- Clients Table
CREATE TABLE clients (
    client_id INT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    birthdate DATE
);

-- Stylists Table
CREATE TABLE stylists (
    stylist_id INT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    specialty VARCHAR(50) NOT NULL,
    hire_date DATE NOT NULL,
    email VARCHAR(50)
);

-- ServiceCategories Table
CREATE TABLE service_categories (
    category_id INT PRIMARY KEY,
    category_name VARCHAR(50)
);

-- Services Table
CREATE TABLE services (
    service_id INT PRIMARY KEY,
    service_name VARCHAR(50) NOT NULL,
    category_id INT  NOT NULL,
    price DECIMAL(10, 2),
    duration TIME,
    FOREIGN KEY (category_id) REFERENCES service_categories(category_id)
);

-- Appointments Table
CREATE TABLE appointments (
    appointment_id INT PRIMARY KEY,
    client_id INT NOT NULL,
    stylist_id INT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status VARCHAR(50) NOT NULL,
    FOREIGN KEY (client_id) REFERENCES clients(client_id),
    FOREIGN KEY (stylist_id) REFERENCES stylists(stylist_id)
);

-- AppointmentServices Table
CREATE TABLE appointment_services (
    appointment_id INT NOT NULL,
    service_id INT NOT NULL,
    PRIMARY KEY (appointment_id, service_id),
    FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id),
    FOREIGN KEY (service_id) REFERENCES services(service_id)
);

-- Promotions Table
CREATE TABLE promotions (
    promotion_id INT PRIMARY KEY,
    promotion_name VARCHAR(50) NOT NULL,
    discount_percentage DECIMAL(5, 2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL
);

-- Products Table
CREATE TABLE products (
    product_id INT PRIMARY KEY,
    product_name VARCHAR(50) NOT NULL,
    brand VARCHAR(50),
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT NOT NULL,
    service_id INT NOT NULL, 
    promotion_id INT,
    FOREIGN KEY (service_id) REFERENCES services(service_id),
    FOREIGN KEY (promotion_id) REFERENCES promotions(promotion_id)
);

-- Inventory Table
CREATE TABLE inventory (
    inventory_id INT PRIMARY KEY,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    reorder_level INT NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- Payments Table
CREATE TABLE payments (
    payment_id INT PRIMARY KEY IDENTITY,
    appointment_id INT UNIQUE NOT NULL,
    payment_date DATE NOT NULL,
    payment_amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id)
);

