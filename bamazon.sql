DROP DATABASE IF EXISTS bAmazonDB;
CREATE database bAmazonDB;

USE bAmazonDB;

CREATE TABLE products (
  id_item INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(100) NULL,
  price DECIMAL(10,2) NULL,
  stock_quantity INT NOT NULL,
  PRIMARY KEY (id_item)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Toaster", "Home Goods", 29.99, 100),
("Puzzle", "Entertainment", 19.99, 80),
("TV", "Electronics", 599.99, 40),
("Tablet", "Electronics", 299.99, 50),
("Camera", "Electronics", 499.99, 50),
("BoardGame", "Entertainment", 29.99, 100),
("Socks", "Apparel", 14.99, 300),
("Shirt", "Apparel", 45.99, 270),
("Pants", "Apparel", 59.99, 250),
("Belt", "Apparel", 40.99, 120);

SELECT * FROM products;