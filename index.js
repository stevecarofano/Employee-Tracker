const mysql = require('mysql');
const inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'steviec',
    database: 'employee_db',
  });

  const runSearch = () => {
    inquirer
      .prompt({
        name: 'options',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
          'View Departments',
          'View Roles',
          'View Employees',
          'Add Department',
          'Add Role',
          'Add Employee',
          'Update Employee Role',
          'Exit',
        ],
      })
      