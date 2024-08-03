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
client.connect()
    .then(() => console.log('Connected to the database.'))
    .catch(err => console.error('Database connection error:', err.stack));

// Define your query functions

async function viewAllDepartments() {
    try {
        const res = await client.query('SELECT * FROM department');
        console.table(res.rows);
    } catch (err) {
        console.error('Error viewing departments:', err.message);
    }
}

async function viewAllRoles() {
    try {
        const res = await client.query(`
            SELECT role.id, role.title, role.salary, department.name AS department
            FROM role
            JOIN department ON role.department_id = department.id
        `);
        console.table(res.rows);
    } catch (err) {
        console.error('Error viewing roles:', err.message);
    }
}

async function viewAllEmployees() {
    try {
        const res = await client.query(`
            SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, manager.first_name AS manager
            FROM employee
            JOIN role ON employee.role_id = role.id
            JOIN department ON role.department_id = department.id
            LEFT JOIN employee manager ON employee.manager_id = manager.id
        `);
        console.table(res.rows);
    } catch (err) {
        console.error('Error viewing employees:', err.message);
    }
}

async function addDepartment(name) {
    try {
        await client.query('INSERT INTO department (name) VALUES ($1)', [name]);
        console.log(`Added department: ${name}`);
    } catch (err) {
        console.error('Error adding department:', err.message);
    }
}

async function addRole(title, salary, department_id) {
    try {
        const validDepartments = await client.query('SELECT id FROM department WHERE id = $1', [department_id]);
        if (validDepartments.rows.length === 0) {
            throw new Error(`Department ID ${department_id} does not exist.`);
        }
        
        await client.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, department_id]);
        console.log(`Added role: ${title}`);
    } catch (err) {
        console.error('Error adding role:', err.message);
    }
}

async function addEmployee(first_name, last_name, role_id, manager_id) {
    try {
        const validRoles = await client.query('SELECT id FROM role WHERE id = $1', [role_id]);
        if (validRoles.rows.length === 0) {
            throw new Error(`Role ID ${role_id} does not exist.`);
        }

        await client.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [first_name, last_name, role_id, manager_id || null]);
        console.log(`Added employee: ${first_name} ${last_name}`);
    } catch (err) {
        console.error('Error adding employee:', err.message);
    }
}

async function updateEmployeeRole(employee_id, role_id) {
    try {
        const validEmployees = await client.query('SELECT id FROM employee WHERE id = $1', [employee_id]);
        if (validEmployees.rows.length === 0) {
            throw new Error(`Employee ID ${employee_id} does not exist.`);
        }
        
        const validRoles = await client.query('SELECT id FROM role WHERE id = $1', [role_id]);
        if (validRoles.rows.length === 0) {
            throw new Error(`Role ID ${role_id} does not exist.`);
        }

        await client.query('UPDATE employee SET role_id = $1 WHERE id = $2', [role_id, employee_id]);
        console.log(`Updated employee ID ${employee_id} to role ID ${role_id}`);
    } catch (err) {
        console.error('Error updating employee role:', err.message);
    }
}

// Export both client and query functions
module.exports = { 
    client,  // Exporting client so it can be used elsewhere
    viewAllDepartments, 
    viewAllRoles, 
    viewAllEmployees, 
    addDepartment, 
    addRole, 
    addEmployee, 
    updateEmployeeRole 
};
