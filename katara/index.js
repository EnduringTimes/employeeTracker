const inquirer = require('inquirer');
const { viewAllDepartments, viewAllRoles, viewAllEmployees, addDepartment, addRole, addEmployee, updateEmployeeRole } = require('./db/queries');

function mainMenu() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                'View All Departments',
                'View All Roles',
                'View All Employees',
                'Add Department',
                'Add Role',
                'Add Employee',
                'Update Employee Role',
                'Exit'
            ]
        }
    ]).then(answer => {
        switch (answer.action) {
            case 'View All Departments':
                viewAllDepartments().then(mainMenu);
                break;
            case 'View All Roles':
                viewAllRoles().then(mainMenu);
                break;
            case 'View All Employees':
                viewAllEmployees().then(mainMenu);
                break;
            case 'Add Department':
                inquirer.prompt([
                    { type: 'input', name: 'name', message: 'Enter the name of the department:' }
                ]).then(({ name }) => {
                    addDepartment(name).then(mainMenu);
                });
                break;
            case 'Add Role':
                inquirer.prompt([
                    { type: 'input', name: 'title', message: 'Enter the title of the role:' },
                    { type: 'input', name: 'salary', message: 'Enter the salary of the role:' },
                    { type: 'input', name: 'department_id', message: 'Enter the department ID of the role:' }
                ]).then(({ title, salary, department_id }) => {
                    addRole(title, salary, department_id).then(mainMenu);
                });
                break;
            case 'Add Employee':
                inquirer.prompt([
                    { type: 'input', name: 'first_name', message: 'Enter the first name of the employee:' },
                    { type: 'input', name: 'last_name', message: 'Enter the last name of the employee:' },
                    { type: 'input', name: 'role_id', message: 'Enter the role ID of the employee:' },
                    { type: 'input', name: 'manager_id', message: 'Enter the manager ID of the employee (if any):' }
                ]).then(({ first_name, last_name, role_id, manager_id }) => {
                    addEmployee(first_name, last_name, role_id, manager_id).then(mainMenu);
                });
                break;
            case 'Update Employee Role':
                inquirer.prompt([
                    { type: 'input', name: 'employee_id', message: 'Enter the ID of the employee:' },
                    { type: 'input', name: 'role_id', message: 'Enter the new role ID of the employee:' }
                ]).then(({ employee_id, role_id }) => {
                    updateEmployeeRole(employee_id, role_id).then(mainMenu);
                });
                break;
            case 'Exit':
                client.end();
                console.log('Goodbye!');
                break;
        }
    });
}

mainMenu();
