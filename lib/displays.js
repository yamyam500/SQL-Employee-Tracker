const inquirer = require("inquirer");

function displayTable(data){
  console.log("\n");
  console.table(data);
}



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
 displayTable
}