
USE bamazon_db;

DROP TABLE products;

CREATE TABLE products (
   item_id INT AUTO_INCREMENT,
    product_name VARCHAR(20) NOT NULL,
    department_name VARCHAR(20) NOT NULL,
    price DECIMAL(10 , 2 ) NOT NULL,
    stock_quantity INT NOT NULL,
    product_sales INT NOT NULL,
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales) VALUES
("t-shirt", "apparel_dep", 10 ,  1000, 0),
("headphones", "music_dep", 25, 2000, 0),
("book","books_dep", 12, 10000, 0),
("backpack", "sport_dep",60, 3000, 0),
("computer","electronics_dep", 1500, 7000, 0),
("sun glasses", "apparel_dep", 10, 3000, 0),
("notebook", "work_dep", 10, 3000, 0),
("pen", "work_dep", 1, 2500, 0),
("chair", "furniture_dep", 200, 3, 0),
("coffee", "food_dep", 3, 4, 0);


SELECT * FROM products;