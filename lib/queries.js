const inquirer = require("inquirer");
const connection = require("../config/connection");

/*
  We are making use of a mysql2 method called promise() which allows us to 
  perform our database query asynchronously. This means we don't need to use
  .then() blocks or callback functions, which makes it much easier run the queries 
  and return values from them.
*/

function listAllDepartments(){
  return connection.promise().query("SELECT department.id, department.name FROM department;");
}
function listAllRoles(){
  return connection.promise().query('SELECT role.id, role.title, role.salary, department.name AS deparment FROM role LEFT JOIN department ON role.department_id = department.id; ')
}

function listAllEmployees(){
  return connection.promise().query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name,'',manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id=department.id LEFT JOIN employee manager on manager.id=employee.manager_id;" )
}
function addDepartment(data){
  return connection.promise().query(`INSERT INTO department SET ?`,{
    name:data.name 
  })
}
function addRole(data){
  return connection.promise.query("INSERT INTO role SET ?", {
    title:data.roleTitle,
    salary:data.RoleSalary,
    department_id:data.roleDepartment
  })
}

module.exports = {
  listAllDepartments, 
  listAllRoles,
  listAllEmployees,
  addDepartment,
  addRole
}