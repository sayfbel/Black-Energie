
-- Improved database schema for black_energie

CREATE DATABASE IF NOT EXISTS black_energie;
USE black_energie;

-- ADMIN TABLE
CREATE TABLE admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PRODUCTS
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  product_type ENUM('single','pack') DEFAULT 'single',
  intensity INT DEFAULT 5,
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PRODUCT WEIGHTS
CREATE TABLE product_weights (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  weight_value VARCHAR(50) NOT NULL,
  weight_unit VARCHAR(20) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- COUPONS
CREATE TABLE coupons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  discount_type ENUM('percentage','fixed') NOT NULL,
  discount_value DECIMAL(10,2) NOT NULL,
  min_order_amount DECIMAL(10,2) DEFAULT 0,
  start_date DATETIME,
  end_date DATETIME,
  is_active TINYINT(1) DEFAULT 1,
  usage_limit INT DEFAULT NULL,
  used_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DELIVERY COSTS
CREATE TABLE delivery_costs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  city VARCHAR(255) NOT NULL UNIQUE,
  cost DECIMAL(10,2) NOT NULL DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- OFFERS
CREATE TABLE offers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type ENUM('single','group','all') NOT NULL,
  discount_type ENUM('percentage','fixed') NOT NULL,
  discount_value DECIMAL(10,2) NOT NULL,
  start_date DATETIME,
  end_date DATETIME,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- OFFER PRODUCTS (MANY TO MANY)
CREATE TABLE offer_products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  offer_id INT NOT NULL,
  product_id INT NOT NULL,
  FOREIGN KEY (offer_id) REFERENCES offers(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ORDERS
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  product_weight_id INT,
  customer_name VARCHAR(255) NOT NULL,
  customer_whatsapp VARCHAR(50) NOT NULL,
  customer_address TEXT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  subtotal DECIMAL(10,2),
  delivery_cost DECIMAL(10,2),
  total_price DECIMAL(10,2),
  status ENUM('pending','confirmed','preparing','shipped','delivered','cancelled') DEFAULT 'pending',
  coupon_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (product_weight_id) REFERENCES product_weights(id),
  FOREIGN KEY (coupon_id) REFERENCES coupons(id)
);

-- RATINGS
CREATE TABLE ratings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  rating INT NOT NULL,
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- INDEXES
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at);
