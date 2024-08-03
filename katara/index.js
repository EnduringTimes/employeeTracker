const inquirer = require('inquirer');
const { client, viewAllDepartments, viewAllRoles, viewAllEmployees, addDepartment, addRole, addEmployee, updateEmployeeRole } = require('./db/queries');

async function mainMenu() {
    const { action } = await inquirer.prompt([
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
    ]);

    switch (action) {
        case 'View All Departments':
            await viewAllDepartments();
            break;
        case 'View All Roles':
            await viewAllRoles();
            break;
        case 'View All Employees':
            await viewAllEmployees();
            break;
        case 'Add Department':
            await promptAddDepartment();
            break;
        case 'Add Role':
            await promptAddRole();
            break;
        case 'Add Employee':
            await promptAddEmployee();
            break;
        case 'Update Employee Role':
            await promptUpdateEmployeeRole();
            break;
        case 'Exit':
            console.log('Goodbye!');
            client.end();  // Close the database connection
            process.exit();
    }

    mainMenu(); // Loop back to the main menu after an action
}

async function promptAddDepartment() {
    const { name } = await inquirer.prompt([
        { type: 'input', name: 'name', message: 'Enter the name of the department:' }
    ]);
    await addDepartment(name);
}

async function promptAddRole() {
    const departments = await getDepartments();

    const { title, salary, department_id } = await inquirer.prompt([
        { type: 'input', name: 'title', message: 'Enter the title of the role:' },
        { type: 'input', name: 'salary', message: 'Enter the salary of the role:' },
        {
            type: 'list',
            name: 'department_id',
            message: 'Select the department for the role:',
            choices: departments.map(department => ({
                name: department.name,
                value: department.id
            }))
        }
    ]);

    await addRole(title, salary, department_id);
}

async function promptAddEmployee() {
    const roles = await getRoles();
    const employees = await getEmployees();

    const { first_name, last_name, role_id, manager_id } = await inquirer.prompt([
        { type: 'input', name: 'first_name', message: 'Enter the first name of the employee:' },
        { type: 'input', name: 'last_name', message: 'Enter the last name of the employee:' },
        {
            type: 'list',
            name: 'role_id',
            message: 'Select the role for the employee:',
            choices: roles.map(role => ({
                name: role.title,
                value: role.id
            }))
        },
        {
            type: 'list',
            name: 'manager_id',
            message: 'Select the manager for the employee:',
            choices: [{ name: 'None', value: null }].concat(employees.map(employee => ({
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id
            })))
        }
    ]);

    await addEmployee(first_name, last_name, role_id, manager_id);
}

async function promptUpdateEmployeeRole() {
    const employees = await getEmployees();
    const roles = await getRoles();

    const { employee_id, role_id } = await inquirer.prompt([
        {
            type: 'list',
            name: 'employee_id',
            message: 'Select the employee to update:',
            choices: employees.map(employee => ({
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id
            }))
        },
        {
            type: 'list',
            name: 'role_id',
            message: 'Select the new role for the employee:',
            choices: roles.map(role => ({
                name: role.title,
                value: role.id
            }))
        }
    ]);

    await updateEmployeeRole(employee_id, role_id);
}

async function getDepartments() {
    const res = await client.query('SELECT * FROM department');
    return res.rows;
}

async function getRoles() {
    const res = await client.query('SELECT * FROM role');
    return res.rows;
}

async function getEmployees() {
    const res = await client.query('SELECT * FROM employee');
    return res.rows;
}

mainMenu();
