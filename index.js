const inquirer = require("inquirer");
const db = require("./config/connection");
const {
  listAllDepartments,
  listAllRoles,
  addDepartment,
  listAllEmployees,
  addRole,
  addEmployees,
  updateEmployeeRole,
} = require("./lib/queries");
const { displayTable } = require("./lib/displays");
/*
  There are a lot of menu items presented to users in this app. The only real way you cam manage them 
  is by creating a function to handle each one.

  I'm giving you a bit of starter code below.
*/

function start() {
  inquirer
    .prompt([
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
          "quit"
        ],
      },
    ])
    .then((response) => {
      switch (response.option) {
        case "List all Departments":
          renderDepartments();
          break;

        case "List all Roles":
          renderRoles();
          break;

        case "List all Employees":
          renderEmployees();
          break;

        case "Add a Department":
          addingDepartment();
          break;
        case "Add a Role":
          addingRole();
          break;

        case "Add an Employee":
          addingEmployee();
          break;

        case "Update Employee Role":
          newEmployeeRole()
          break;
          default:
            db.end()
            break;
      }
    })
  }
          
// !RENDER DEPARTMENTS, ROLES AND EMPLOYEES
const renderDepartments = () => {
  listAllDepartments().then(([rows]) => {
    displayTable(rows);
    start();
  });
};

const renderRoles = () => {
  listAllRoles().then(([rows]) => {
    displayTable(rows);
    start();
  });
};
const renderEmployees = () => {
  listAllEmployees().then(([rows]) => {
    displayTable(rows);
    start();
  });
};

// !ADD DEPARTMENT, ROLE AND EMPLOYEE

const addingDepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the name of the new department?",
        name: "name",
      },
    ])
    .then((response) => {
      addDepartment(response).then(() => {
        listAllDepartments().then(([rows]) => {
          displayTable(rows);
          console.log(
            `${response.departmentName} Department has been added to database.`
          );
          start();
        });
      });
    });
};

const addingRole = () => {
  db.query("SELECT * FROM department;", (err, res) => {
    const departments = res.map((department) => {
      console.log(department);
      return {
        name: department.name,
        value: department.id,
      };
    });

    inquirer
      .prompt([
        {
          type: "input",
          message: "What is the title of the new role?",
          name: "roleTitle",
        },
        {
          type: "input",
          message: "What is the salary of the new role?",
          name: "roleSalary",
        },
        {
          type: "list",
          message: "What department does the new role belong to?",
          name: "roleDepartment",
          choices: departments,
        },
      ])

      .then((response) => addRole(response))
      .then(() => listAllRoles())
      .then(([rows]) => {
        displayTable(rows);
        start();
      })

      .catch((error) => {
        console.error(error);
      });
  });
};

const addingEmployee = () => {
  db.query("SELECT * FROM role", (err, res) => {
    if (err) throw err;
    const roles = res.map((role) => ({
      name: role.title,
      value: role.id,
    }));
    db.query("SELECT * FROM employee", (err, res) => {
      if (err) throw err;
      const managers = res.map((manager) => ({
        name: manager.first_name + " " + manager.last_name,
        value: manager.id,
      }));

      inquirer
        .prompt([
          {
            type: "input",
            message: "What is the  new employee's first name?",
            name: "firstName",
          },
          {
            type: "input",
            message: "What is the new employee's last name?",
            name: "lastName",
          },
          {
            type: "list",
            message: "What role will be assigned to the new employee?",
            name: "employeeRole",
            choices: roles,
          },
          {
            type: "list",
            message: "Who is the new employee's manager?",
            name: "employeeManager",
            choices: managers,
          },
        ])
        .then((answers) => addEmployees(answers))
        .then(() => listAllEmployees())
        .then(([rows]) => {
          displayTable(rows);
          start();
        });
    });
  });
};

//!UPDATE EMPLOYEE ROLE

const newEmployeeRole = () => {
  listAllEmployees().then(([rows]) => {
    let employees = rows;
    const employeeList = employees.map(({ id, first_name, last_name }) => ({
      name: first_name + " " + last_name,
      value: id,
    }));
    inquirer
      .prompt([
        {
          type: "list",
          message: "Which employee do you want to update the role for??",
          name: "employeeName",
          choices: employeeList,
        },
      ])
      .then((response) => {
        let empId = response.employeeName;
        listAllRoles().then(([rows]) => {
          let roles = rows;
          const rolesList = roles.map(({ id, title }) => ({
            name: title,
            value: id,
          }));
          inquirer.prompt([
            {
              type: "list",
              message: "What is their new role?",
              name: "employeeRole",
              choices: rolesList,
            },
          ]).then((answers)=>{updateEmployeeRole( empId, answers.employeeRole)})
          .then(()=> listAllEmployees())
          .then(([rows])=>{
            displayTable(rows)
            start();
          })
        });
      });
  });
};

start();


