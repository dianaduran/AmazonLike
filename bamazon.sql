drop database if exists bamazon;

create database bamazon;

use bamazon;

create table products
(
 item_id INT NOT NULL AUTO_INCREMENT,
 product_name varchar(30),
 department_name varchar(30),
 price float(10),
 stock_quantity int,
 PRIMARY KEY (item_id)
);


create table departments
(
department_id INT NOT NULL AUTO_INCREMENT,
department_name varchar(30),
over_head_costs int,
primary key (department_id)
);

ALTER TABLE products
  ADD product_sales int;
  
  drop table products;
  drop table departments;
  
 select departments.department_id, departments.department_name, departments. over_head_costs,
 products.product_sales, products.product_sales- departments. over_head_costs as total_profit
 from departments
 INNER JOIN products on departments.department_name=products.department_name;