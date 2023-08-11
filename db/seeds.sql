use employees;

INSERT INTO department
    (id,name)
VALUES
    (1,'Sales'),
    (2,'Engineering'),
    (3,'Finance'),
    (4,'Legal');


INSERT INTO role
  (id,title, salary, department_id)
VALUES
  (1,'Software Engineer', 85000, 1),
  (2,'Salesperson', 75000, 2),
  (3,'Accountant', 125000, 3),
  (4,'Lawyer', 200000, 4);


INSERT INTO employee(id,first_name,last_name,role_id,manager_id)
  (first_name, last_name, role_id, manager_id)
VALUES
  (1,'Juan', 'Garcia', 1, null),
  (2,'Jonathan', 'Villcapoma', 2, 1),
  (3,'Jesus', 'Meraz', 3, 1),
  (4,'Estefany', 'Munoz', 4, 2);