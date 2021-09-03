const mysql = require('mysql');
const inquirer = require("inquirer");
const figlet = require('figlet'); // To generate banner

// Setting up mysql connection
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'steviec',
    database: 'employeetracker',
  });

  // Function to initialize app
  const lookUp = () => {
    inquirer
      .prompt({
        name: 'options',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
          'View  All Employees by Department',
          'View All Employees by Role',
          'View All Employees',
          'Add Department',
          'Add Role',
          'Add Employee',
          'Update Employee Role',
          'Exit',
        ],
      })
      // Switching based off user input
      .then((answer) => {
        switch (answer.options) {
          case 'View  All Employees by Department':
            viewDepts();
            break;
    
          case 'View All Employees by Role':
            viewRoles();
            break;
    
          case 'View All Employees':
            viewEmployees();
            break;
    
          case 'Add Department':
            addDepartment();
            break;
    
          case 'Add Role':
            addRole();
            break;
    
          case 'Add Employee':
            addEmployee();
            break;
    
    
          case 'Update Employee Role':
            updateEmployee();
            break;
    
          case 'Exit':
            connection.end();
            break;
    
          default:
            console.log(`Invaild action: ${answer.action}`);
            break;
        }
      });
    };
    
    const viewDepts = () => {
    connection.query("SELECT * FROM department", (err, res) => {
      if (err) throw err;
      console.table(res);
      lookUp();
    });
    };
    
    const viewRoles = () => {
    connection.query("SELECT * FROM role", (err, res) => {
      if (err) throw err;
      console.table(res);
      lookUp();
    });
    };
    
    const viewEmployees = () => {
    connection.query("SELECT * FROM employee", (err, res) => {
      if (err) throw err;
      console.table(res);
      lookUp();
    });
    };
    
    const addDepartment = () => {
    inquirer.prompt([
      {
        name: "newDep",
        message: "What is the new department that you would like to add?"
      }
    ]).then(({ newDep }) => {
      let queryString = `
            INSERT INTO department (name)
            VALUES (?)`
    
      connection.query(queryString, [newDep], (err, data) => {
        if (err) throw err;
        console.log('New Department was added successfully!');
        lookUp()
      })
    })
    }
    
    
    const addRole = () => {
    inquirer
      .prompt([
        {
          name: 'id',
          type: 'input',
          message: 'What is the new role id number?',
        },
        {
          name: 'title',
          type: 'input',
          message: 'What is the new role title?',
        },
        {
          name: 'salary',
          type: 'input',
          message: 'What is the new role salary?',
        },
        {
          name: 'deptID',
          type: 'input',
          message: 'What is the department ID?',
        },
      ])
      .then((answer) => {
        connection.query(
          'INSERT INTO role SET ?',
          {
            id: answer.id,
            title: answer.title,
            salary: answer.salary,
            department_id: answer.deptID,
          },
          (err) => {
            if (err) throw err;
            console.log('New role was added successfully!');
            lookUp();
          }
        );
      });
    };
    
    const addEmployee = () => {
    inquirer
      .prompt([
        {
          name: 'id',
          type: 'input',
          message: 'What is the new employees id number?',
        },
        {
          name: 'firstName',
          type: 'input',
          message: 'What is the new employees first name?',
        },
        {
          name: 'lastName',
          type: 'input',
          message: 'What is the new employees last name?',
        },
        {
          name: 'roleID',
          type: 'input',
          message: 'What is the role ID for the new employee?',
        },
        {
          name: 'managerID',
          type: 'input',
          message: 'What is the manager ID associated?',
        },
      ])
      .then((answer) => {
        connection.query(
          'INSERT INTO employee SET ?',
          {
            id: answer.id,
            first_name: answer.firstName,
            last_name: answer.lastName,
            role_id: answer.roleID,
            manager_id: answer.managerID,
          },
          (err) => {
            if (err) throw err;
            console.log('Your new employee was added!');
            lookUp();
          }
        );
      });
    };
    
    const updateEmployee = () => {
    connection.query('SELECT * FROM employee', (err, res) => {
      if (err) throw err;
      let all = [];
      for (let i = 0; i < res.length; i++) {
        all.push(res[i].first_name);
      }
      inquirer
        .prompt([
          {
            name: "select",
            type: "list",
            message: "Which employee would you like to update?",
            choices: all,
          },
          {
            name: "roleID",
            type: "input",
            message: "Please enter the new Role ID for this employee.",
          },
        ])
        .then((answer) => {
          if (err) throw err;
          connection.query('UPDATE employee SET ? WHERE ?',
            [
              {
                role_id: answer.roleID,
              },
              {
                first_name: answer.select,
              },
            ],
            (err, res) => {
              if (err) throw err;
              viewEmployees();
            })
        })
    });
    };
    // Function to display figlet banner
    const banner = async () => {
      figlet('Employee Tracker', function(err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(data);
        lookUp();
    });
      // lookUp();
    };
    banner();
      