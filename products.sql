
USE bamazon_db;

DROP TABLE products;

CREATE TABLE products (
   item_id INT AUTO_INCREMENT,
    product_name VARCHAR(20) NOT NULL,
    department_name VARCHAR(20) NOT NULL,
    price DECIMAL(10 , 2 ) NOT NULL,
    stock_quantity INT NOT NULL,
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES
("t-shirt", "apparel_dep", 15 ,  60),
("headphones", "music_dep", 25, 20),
("book","books_dep", 12, 100),
("backpack", "sport_dep",60, 30),
("computer","electronics_dep", 1500, 100),
("sun glasses", "apparel_dep",30, 100),
("coffee", "food_dep", 3, 4),
("notebook", "work_dep", 50, 10),
("pen", "work_dep", 1, 250),
("chair", "furniture_dep", 200, 10);

SELECT * FROM products;