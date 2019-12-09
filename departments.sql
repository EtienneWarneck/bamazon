USE bamazon_db;

DROP TABLE departments;

CREATE TABLE departments (
   department_id INT AUTO_INCREMENT,
    department_name VARCHAR(20) NOT NULL,
    over_head_cost INT NOT NULL,
    PRIMARY KEY (department_id)
);

INSERT INTO departments (department_name, over_head_cost) VALUES
("apparel_dep", 1000),
("music_dep", 2000),
("books_dep", 7000),
("sport_dep",3000),
("electronics_dep", 10000),
("food_dep", 12000),
("work_dep",5000),
("furniture_dep", 4000);

SELECT * FROM departments;