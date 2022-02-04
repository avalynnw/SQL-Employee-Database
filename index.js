// import and require dependancies
const express = require('express');
const mysql = require('mysql2');
const cTable = require('console.table');
const inquirer = require('inquirer');
// const sequelize = require('sequelize');

const PORT = process.env.PORT || 3001;
const app = express();

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// question lists
const menu_list = [
    {
        type: 'list',
        message: 'what would you like to do?',
        name: 'menu_choice',
        choices: [  "view all employees",
                    "add employee",
                    "update employee role",
                    "view all roles",
                    "add role",
                    "view all departments",
                    "add department",
                    "quit"
        ],
    }
]

const add_department = [
    {
        type: 'input',
        message: 'what is the name of the department?',
        name: 'add_department_name',
    }
]

const add_role = [
    {
        type: 'input',
        message: 'what is the name of the role?',
        name: 'add_role_name',
    },
    {
        type: 'input',
        message: 'what is the salary of the role?',
        name: 'add_role_salary',
    }
]



const config = {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: 'password666',
    database: 'employee_db'
}

// function to view employees
async function viewEmployees () {
    const db = mysql.createConnection(config);
    await db.promise().query(`  
    SELECT 
    e.id AS id,
    e.first_name AS first_name,
    e.last_name AS last_name,
    r.title AS title,
    d.name AS department,
    r.salary AS salary,
    concat(m.first_name, ' ', m.last_name) AS manager
    FROM employee e
    JOIN role AS r ON r.id = e.role_id
    JOIN department AS d ON d.id = r.department_id
    LEFT JOIN employee AS m ON e.manager_id = m.id
    ORDER BY id ASC`)
    .then(([rows]) => {
        console.log(" ");
        console.table(rows);
    })
    .catch(error => {
        throw error;
    });
}

// function to view roles
async function viewRoles() {
    const db = mysql.createConnection(config);
    await db.promise().query(`  
    SELECT 
    r.id AS id, 
    r.title AS title, 
    d.name as department,
    r.salary AS salary
    FROM role r
    JOIN department d on d.id = r.department_id
    ORDER BY id ASC
    `)
    .then(([rows]) => {
        console.log(" ");
        console.table(rows);
    })
    .catch(error => {
        throw error;
    });
};



// function to view departments
async function viewDepartments() {
    const db = mysql.createConnection(config);
    await db.promise().query(`  
    SELECT * FROM department
    ORDER BY id ASC;`)
    .then(([rows]) => {
        console.log(" ");
        console.table(rows);
    })
    .catch(error => {
        throw error;
    });
};



// function to add a department
async function addDepartment(input) {
    const db = mysql.createConnection(config);
    await db.promise().query(`    
    INSERT INTO department (name)
    VALUES ("${input.add_department_name}");`)
    .then(([rows]) => {
        console.table(`\nadded ${input.add_department_name} to the database`);
    })
    .catch(error => {
        throw error;
    });
};





// function to add a role
async function addRole(input) {
    const db = mysql.createConnection(config);
    await db.promise().query(`    
    INSERT INTO department (name)
    VALUES ("${input.add_department_name}");`)
    .then(([rows]) => {
        console.table(`\nadded ${input.add_department_name} to the database`);
    })
    .catch(error => {
        throw error;
    });
};





// initialize app
function init() {
    console.log(`%c
    ┌─┐┌┬┐┌─┐┬  ┌─┐┬ ┬┌─┐┌─┐  ┌┬┐┌─┐┌┬┐┌─┐┌┐ ┌─┐┌─┐┌─┐
    ├┤ │││├─┘│  │ │└┬┘├┤ ├┤    ││├─┤ │ ├─┤├┴┐├─┤└─┐├┤ 
    └─┘┴ ┴┴  ┴─┘└─┘ ┴ └─┘└─┘  ─┴┘┴ ┴ ┴ ┴ ┴└─┘┴ ┴└─┘└─┘
    `, `font-family: monospace`);

    menu();
}

async function menu() {

    let menu_option = await inquirer.prompt(menu_list)
    
    if (menu_option.menu_choice == 'view all employees') {
        await viewEmployees();
        menu();
    } 
    if (menu_option.menu_choice == 'view all roles') {
        await viewRoles();
        menu();
    } 
    if (menu_option.menu_choice == 'view all departments') {
        await viewDepartments();
        menu();
    }
    if (menu_option.menu_choice == 'add department') {
        var department_input = await inquirer.prompt(add_department)
        await addDepartment(department_input);
        menu();
    }
    if (menu_option.menu_choice == 'add role') {
        var role_input = await inquirer.prompt(add_role)
        await addRole(department_input);
        menu();
    }
}


init()
