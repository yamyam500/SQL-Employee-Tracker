const inquirer = require("inquirer");


function displayAllDepartments(data){
  console.log("\n");
  console.table(data);
}

function displayAllRoles(data){
  console.table(data)
}
function displayAllEmployees(data){
  console.table(data)
}

module.exports = {
  displayAllDepartments,
  displayAllRoles,
  displayAllEmployees
}