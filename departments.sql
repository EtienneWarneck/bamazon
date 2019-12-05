
USE bamazon_db;

DROP TABLE departments;

CREATE TABLE departments (
   department_id INT AUTO_INCREMENT,
    department_name VARCHAR(20) NOT NULL,
    over_head_cost INT NOT NULL,
    PRIMARY KEY (department_id)
);

INSERT INTO departments (department_name, over_head_cost) VALUES
("apparel_dep", 10000),
("music_dep", 20000),
("books_dep", 10000),
("sport_dep",30000),
("electronics_dep", 50000),
("food_dep", 100000),
("work_dep",50000),
("furniture_dep", 30000);

SELECT * FROM departments;