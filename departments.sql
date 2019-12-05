
USE bamazon_db;

DROP TABLE departments;

CREATE TABLE departments (
   department_id INT AUTO_INCREMENT,
    department_name VARCHAR(20) NOT NULL,
    over_head_cost INT NOT NULL,
    PRIMARY KEY (department_id)
);

INSERT INTO departments (department_name, over_head_cost) VALUES
("apparel_dep", 10),
("music_dep", 20),
("books_dep", 10),
("sport_dep",30),
("electronics_dep", 50),
("food_dep", 100),
("work_dep",50),
("furniture_dep", 30);

SELECT * FROM departments;