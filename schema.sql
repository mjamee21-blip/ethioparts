-- Cloudflare D1 Database Schema for EthioParts

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('admin', 'merchant', 'buyer')),
  merchant_id TEXT,
  phone TEXT,
  verified INTEGER DEFAULT 0,
  joined_date TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS merchants (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  city TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  rating REAL DEFAULT 5.0,
  total_products INTEGER DEFAULT 0,
  joined_date TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  merchant_id TEXT NOT NULL,
  merchant_name TEXT NOT NULL,
  name TEXT NOT NULL,
  part_number TEXT NOT NULL,
  category TEXT NOT NULL,
  price REAL NOT NULL,
  stock INTEGER NOT NULL,
  condition TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  buyer_id TEXT NOT NULL,
  buyer_name TEXT NOT NULL,
  buyer_phone TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  subtotal REAL NOT NULL,
  commission REAL NOT NULL,
  total_amount REAL NOT NULL,
  payment_method_id TEXT NOT NULL,
  payment_method_name TEXT NOT NULL,
  receipt_image TEXT,
  payment_status TEXT NOT NULL DEFAULT 'pending_verification',
  fulfillment_status TEXT NOT NULL DEFAULT 'processing',
  created_at TEXT NOT NULL
);

-- Seed Default Users
INSERT OR IGNORE INTO users (id, name, email, username, password, role, verified, joined_date) 
VALUES 
('usr-1', 'System Administrator', 'admin@ethioparts.et', 'siris888', 'Passw0rd', 'admin', 1, '2024-01-15'),
('usr-2', 'Mesfin Auto Imports', 'mesfin@parts.et', 'marchant', 'password123', 'merchant', 'mch-1', 1, '2024-02-10'),
('usr-4', 'Dawit Tadesse', 'dawit@gmail.com', 'buyer', 'password123', 'buyer', 1, '2024-05-20');
