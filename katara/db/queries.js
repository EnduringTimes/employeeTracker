const { Client } = require('pg');

// Configure the database client connection
const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'soul',
    database: 'emtracker'
});

// Connect to the PostgreSQL database
client.connect().then(() => {
    console.log('Connected to the database.');
}).catch(err => {
    console.error('Database connection error:', err.stack);
});

// View all departments
async function viewAllDepartments() {
    const res = await client.query('SELECT * FROM department');
    console.table(res.rows);
}

// View all roles
async function viewAllRoles() {
    const res = await client.query(`
        SELECT role.id, role.title, role.salary, department.name AS department
        FROM role
        JOIN department ON role.department_id = department.id
    `);
    console.table(res.rows);
}

// View all employees
async function viewAllEmployees() {
    const res = await client.query(`
        SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, manager.first_name AS manager
        FROM employee
        JOIN role ON employee.role_id = role.id
        JOIN department ON role.department_id = department.id
        LEFT JOIN employee manager ON employee.manager_id = manager.id
    `);
    console.table(res.rows);
}

// Add a new department
async function addDepartment(name) {
    await client.query('INSERT INTO department (name) VALUES ($1)', [name]);
    console.log(`Added department: ${name}`);
}

// Add a new role
async function addRole(title, salary, department_id) {
    await client.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, department_id]);
    console.log(`Added role: ${title}`);
}

// Add a new employee
async function addEmployee(first_name, last_name, role_id, manager_id) {
    await client.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [first_name, last_name, role_id, manager_id]);
    console.log(`Added employee: ${first_name} ${last_name}`);
}

// Update an employee's role
async function updateEmployeeRole(employee_id, role_id) {
    await client.query('UPDATE employee SET role_id = $1 WHERE id = $2', [role_id, employee_id]);
    console.log(`Updated employee ID ${employee_id} to role ID ${role_id}`);
}

module.exports = { viewAllDepartments, viewAllRoles, viewAllEmployees, addDepartment, addRole, addEmployee, updateEmployeeRole };
