const inquirer = require("inquirer");
const connection = require("./config/connection");
const { listAllDepartments, listAllRoles, listAllEmployees } = require("./lib/queries")
const { displayAllDepartments, displayAllRoles, displayAllEmployees } = require("./lib/displays")
/*
  There are a lot of menu items presented to users in this app. The only real way you cam manage them 
  is by creating a function to handle each one.

  I'm giving you a bit of starter code below.
*/ 


function start(){
  inquirer.prompt([
    {   
      type: "list",
      message: "What action would you like to take?",
      name: "option", 
      choices: [
        "View All Departments",
        "View All Roles",
        "View All Employees",
        "Add Department"
      ]
    }
  ]).then( response => {
    switch(response.option){
      case "View All Departments":
        listAllDepartments().then( ([rows]) => {
          displayAllDepartments(rows);
          start();
        });
        
        break;
        case"View All Roles":
        listAllRoles().then(([rows])=>{
          displayAllRoles(rows)
          start();
        })
        break;

        case "View All Employees":
          listAllEmployees().then(([rows])=>{
            displayAllEmployees(rows)
            start();
          })
          break;
          case "Add Department":
            addDepartment()
            break;


      default:
        start();
    }
  })
}

function addDepartment(){
  inquirer.prompt([{
    type:"input",
    name:"deptName",
    message:"what is the name of the department you would like to add?"
  }])
  .then((answer)=>{

  })
}

start();

//let allDepartments=listAllDepartments()
//let departments=allDepartments.map((department)=>{
//name:department.name,
//value:department.id
//})

//choices:departments