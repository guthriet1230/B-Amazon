DROP DATABASE IF EXISTS bAmazonDB;
CREATE database bAmazonDB;

USE bAmazonDB;

CREATE TABLE products (
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(100) NULL,
  price DECIMAL(10,2) NULL,
  stock_quantity INT NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Toasters", "Home Goods", 29.99, 100),
("Puzzles", "Entertainment", 19.99, 80),
("TVs", "Electronics", 599.99, 4),
("Tablets", "Electronics", 299.99, 50),
("Cameras", "Electronics", 499.99, 50),
("BoardGames", "Entertainment", 29.99, 100),
("Socks", "Apparel", 14.99, 300),
("Shirts", "Apparel", 45.99, 270),
("Pants", "Apparel", 59.99, 250),
("Belts", "Apparel", 40.99, 120);

SELECT * FROM products;