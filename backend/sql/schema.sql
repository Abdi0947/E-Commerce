CREATE DATABASE IF NOT EXISTS ninamart CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ninamart;

CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(64) NOT NULL,
  price DECIMAL(12, 2) NOT NULL,
  original_price DECIMAL(12, 2) NOT NULL,
  discount INT NOT NULL DEFAULT 0,
  rating DECIMAL(2, 1) NOT NULL DEFAULT 4.5,
  review_count INT NOT NULL DEFAULT 0,
  image TEXT NOT NULL,
  detail_image TEXT,
  gallery JSON,
  availability ENUM('available', 'out_of_stock') NOT NULL DEFAULT 'available',
  description TEXT NOT NULL,
  featured TINYINT(1) NOT NULL DEFAULT 0,
  popular TINYINT(1) NOT NULL DEFAULT 0,
  best_seller TINYINT(1) NOT NULL DEFAULT 0,
  is_visible TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_products_category (category),
  INDEX idx_products_popular (popular),
  INDEX idx_products_best_seller (best_seller)
);

CREATE TABLE IF NOT EXISTS visitor_sessions (
  session_id VARCHAR(64) PRIMARY KEY,
  first_seen_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS site_visits (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  session_id VARCHAR(64) NOT NULL,
  visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_site_visits_session (session_id),
  INDEX idx_site_visits_visited (visited_at),
  CONSTRAINT fk_site_visits_session FOREIGN KEY (session_id) REFERENCES visitor_sessions (session_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS product_view_stats (
  product_id INT PRIMARY KEY,
  view_count INT NOT NULL DEFAULT 0,
  first_viewed_at TIMESTAMP NULL,
  last_viewed_at TIMESTAMP NULL,
  CONSTRAINT fk_product_views_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
);