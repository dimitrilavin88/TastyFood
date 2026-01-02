-- PostgreSQL Schema for TastyFood Database
-- This schema matches the SQLite database structure
-- Run this in Supabase SQL Editor to create all tables

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS login_credentials CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS drivers CASCADE;
DROP TABLE IF EXISTS menu_items CASCADE;
DROP TABLE IF EXISTS item_categories CASCADE;
DROP TABLE IF EXISTS delivery_address CASCADE;

-- Create item_categories table
CREATE TABLE item_categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    display_order INTEGER
);

-- Create menu_items table
CREATE TABLE menu_items (
    item_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    image_url TEXT,
    category_id INTEGER,
    prep_time_minutes INTEGER,
    CONSTRAINT fk_menu_items_category 
        FOREIGN KEY (category_id) 
        REFERENCES item_categories(category_id)
        ON DELETE SET NULL
);

-- Create delivery_address table
CREATE TABLE delivery_address (
    address_id SERIAL PRIMARY KEY,
    building_number INTEGER,
    street VARCHAR(255),
    apt_unit VARCHAR(50),
    city VARCHAR(100),
    state VARCHAR(50),
    zip_code VARCHAR(20)
);

-- Create drivers table
CREATE TABLE drivers (
    driver_id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    on_delivery BOOLEAN NOT NULL DEFAULT FALSE,
    current_order_id INTEGER,
    phone_number VARCHAR(20),
    vehicle_description VARCHAR(255)
);

-- Create employees table
CREATE TABLE employees (
    username VARCHAR(255) PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    active_status BOOLEAN NOT NULL DEFAULT TRUE,
    hire_date DATE,
    last_active_at TIMESTAMP
);

-- Create login_credentials table
CREATE TABLE login_credentials (
    username VARCHAR(255) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    usertype VARCHAR(50) NOT NULL,
    CONSTRAINT fk_login_credentials_employee 
        FOREIGN KEY (username) 
        REFERENCES employees(username)
        ON DELETE CASCADE
);

-- Create orders table
-- Note: Timestamps stored as BIGINT (milliseconds since epoch) to match SQLite
CREATE TABLE orders (
    order_id VARCHAR(6) PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    driver_id INTEGER,
    address_id INTEGER,
    subtotal NUMERIC(10, 2) NOT NULL,
    tip NUMERIC(10, 2),
    grand_total NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at BIGINT NOT NULL,
    estimated_delivery_time BIGINT,
    delivered_at BIGINT,
    last_updated_at BIGINT NOT NULL,
    special_instructions TEXT,
    CONSTRAINT fk_orders_driver 
        FOREIGN KEY (driver_id) 
        REFERENCES drivers(driver_id)
        ON DELETE SET NULL,
    CONSTRAINT fk_orders_address 
        FOREIGN KEY (address_id) 
        REFERENCES delivery_address(address_id)
        ON DELETE SET NULL
);

-- Create order_items table (composite primary key)
CREATE TABLE order_items (
    order_id VARCHAR(6) NOT NULL,
    item_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    line_total NUMERIC(10, 2) NOT NULL,
    PRIMARY KEY (order_id, item_id),
    CONSTRAINT fk_order_items_order 
        FOREIGN KEY (order_id) 
        REFERENCES orders(order_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_order_items_menu_item 
        FOREIGN KEY (item_id) 
        REFERENCES menu_items(item_id)
        ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX idx_menu_items_category_id ON menu_items(category_id);
CREATE INDEX idx_orders_driver_id ON orders(driver_id);
CREATE INDEX idx_orders_address_id ON orders(address_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_item_id ON order_items(item_id);

-- Add comments to tables for documentation
COMMENT ON TABLE item_categories IS 'Categories for menu items (appetizers, main courses, etc.)';
COMMENT ON TABLE menu_items IS 'Individual menu items with pricing and descriptions';
COMMENT ON TABLE delivery_address IS 'Customer delivery addresses';
COMMENT ON TABLE drivers IS 'Delivery driver information';
COMMENT ON TABLE employees IS 'Staff and admin employee records';
COMMENT ON TABLE login_credentials IS 'User authentication credentials';
COMMENT ON TABLE orders IS 'Customer orders with status and delivery information';
COMMENT ON TABLE order_items IS 'Individual items within each order';

