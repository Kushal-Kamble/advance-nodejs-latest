CREATE DATABASE IF NOT EXISTS contacts_db;
USE contacts_db;

CREATE TABLE IF NOT EXISTS contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100),
  message VARCHAR(200)
);