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
      message: "Choose an item from the list below:",
      name: "option", 
      choices: [
        "List all Departments",
        "List all Roles",
        "List all Employees",
        "Add a Department",
        "Add a Role",
        "Add an Employee",
        "Update Employee Role",
      ]
    }
  ]).then( response => {
    switch(response.option){


      // list all departments in the db
      case "List all Departments":
        listAllDepartments().then(([rows]) => {
          // displayTable(rows);
          start();
        });
        break;


      // list all roles in the db
      case "List all Roles":
        listAllRoles().then(([rows]) => {
          displayTable(rows);
          start();
        });
        break;
      

      // list all employees in the db
      case "List all Employees":
        listAllEmployees().then(([rows]) => {
          displayTable(rows);
          start();
        });
        break;
      

      // add a department to the db
      case "Add a Department":
        inquirer.prompt([
          {
            type: 'input',
            message: 'What is the name of the new department?',
            name: 'departmentName'
          }]).then((response) => {
            addDepartment(response).then(() => {
              listAllDepartments().then(([rows]) => {
                displayTable(rows);
                console.log(`${response.departmentName} Department has been added to database.`);
                start();
              });
            })
          });
          break;
      

      // add a role to the db
      case "Add a Role":
        // declare variables
        let titleOfRole
        let salaryOfRole

        // get all departments and put into array to use in prompt
        listAllDepartments()
        .then((departments) => createDepartmentsArray(departments[0]))
        .then((array) => {
          inquirer.prompt([
            {
              type: 'input',
              message: 'What is the title of the new role?',
              name: 'roleTitle'
            },
            {
              type: 'input',
              message: 'What is the salary of the new role?',
              name: 'roleSalary'
            },
            {
              type: 'list',
              message: 'What department does the new role belong to?',
              name: 'roleDepartment',
              choices: array
            },
          ])

          
          .then((response) => {
            titleOfRole = response.roleTitle;
            salaryOfRole = response.roleSalary;
            return findDepartmentId(response.roleDepartment)
          })

          // send data to addRole()
          .then((data) => {
            // console.log(data);
            const data1 = data[0];
            addRole(data1[0].id, titleOfRole, salaryOfRole);
          })

          // display all Roles and success message in terminal
          .then((res) => listAllRoles()).then(([rows]) => {
            displayTable(rows);
                console.log(`${titleOfRole} Role has been added to database.`)
                start();
          })})
        break;
      

        // add an employee to the db
        case "Add an Employee":
          // declare variables
          let fName
          let lName
          let roleArr
          let employeeArr
          let employeeManager
          let roleId

          // get roles and put into array
          listAllRoles()
          .then((roles) => createRolesArray(roles[0]))
          .then((arr) => roleArr = arr)

          // get employees and put into array
          .then(() => listAllEmployees())
          .then((employees) => createEmployeeArray(employees[0]))
          .then((arr) => employeeArr = arr)

          // terminal prompt
          .then(() => {
            inquirer.prompt([
              {
                type: 'input',
                message: "What is the employee's first name?",
                name: 'firstName'
              },
              {
                type: 'input',
                message: "What is the employee's last name?",
                name: 'lastName'
              },
              {
                type: 'list',
                message: 'What role will be assigned to the employee?',
                name: 'employeeRole',
                choices: roleArr,
              },
              {
                type: 'list',
                message: "Who is the new employee's manager?",
                name: 'employeeManager',
                choices: employeeArr,
              },
            ])

            // assign prompt responses to use later
            // find id for role
            .then((response) => {
              fname = response.firstName;
              lname = response.lastName;
              employeeManager = response.employeeManager;
              return findRoleId(response.employeeRole);
            })

            // assign role id to variable
            // find employee id of manager
            .then((id) => {
              roleId = id[0];
              return findEmployeeId(employeeManager);
            })

            // send data to addEmployee
            .then((managerId) => {
              managerId1 = managerId[0];
              return addEmployee(fname, lname, roleId[0].id, managerId1[0].id);
            })
            
            // display all Employees and success message in terminal
            .then((res) => listAllEmployees()).then(([rows]) => {
              displayTable(rows);
                  console.log(`${fname} ${lname} has been added to database.`)
                  start();
            })})
          break;

        
        // update role of an existing employee
        case "Update Employee Role":
          // declare variables
          let rolesList
          let employeeList
          let employeeName
          let newRoleId

          // get roles and put into array
          listAllRoles()
          .then((roles) => createRolesArray(roles[0]))
          .then((arr) => rolesList = arr)

          // get employees and put into array
          .then(() => listAllEmployees())
          .then((employees) => createEmployeeArray(employees[0]))
          .then((arr) => employeeList = arr)

          // terminal prompt
          .then(() => {
            inquirer.prompt([
              {
                type: 'list',
                message: "Which employee do you want to update the role for??",
                name: 'employeeName',
                choices: employeeList,
              },
              {
                type: 'list',
                message: 'What is their new role?',
                name: 'employeeRole',
                choices: rolesList,
              },
            ])
          
            // find employee id
            .then((response) => {
              employeeName = response.employeeName;
              return findRoleId(response.employeeRole);
            })

            // find role id
            .then((id) => {
              newRoleId = id[0];
              return findEmployeeId(employeeName);
            })

            
              .then((employeeId) => {
              let employeeId1 = employeeId[0];
              return updateEmployeeRole(employeeId1[0].id, newRoleId[0].id);
            })

            .then((res) => listAllEmployees()).then(([rows]) => {
              displayTable(rows);
                  console.log(`${employeeName}'s role has been updated.`)
                  start();
            })})
    }
  })
}

start();