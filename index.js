// import and require dependancies
const express = require('express');
const mysql = require('mysql2');
const cTable = require('console.table');
const inquirer = require('inquirer');
// const sequelize = require('sequelize');
const db = require('./db/db_connection.js')

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
    },
    {
        type: 'list',
        message: 'which department does the role belong to?',
        name: 'add_role_department',
        choices: getDepartments()
    }
]





// function to view employees
async function viewEmployees () {
    // const db = mysql.createConnection(config);
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
    // const db = mysql.createConnection(config);
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



// function to view all departments
async function viewDepartments() {
    // const db = mysql.createConnection(config);
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
    // const db = mysql.createConnection(config);
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





// inquirer calls for adding a role
async function addRoleInquirer() {
    var department_choices = await getDepartments();
    let department_choices_list = [];
    department_choices.forEach((item, index) => {
        let {name: placeholder} = item;
        department_choices_list.push(placeholder)
    });
    return new Promise( (resolve, reject) => {
        inquirer.prompt([
            {
                type: 'input',
                message: 'what is the name of the role?',
                name: 'add_role_name',
            },
            {
                type: 'input',
                message: 'what is the salary of the role?',
                name: 'add_role_salary',
            },
            {
                type: 'list',
                message: 'which department does the role belong to?',
                name: 'add_role_department',
                choices: department_choices_list,
            }
        ]).then(({ add_role_name, add_role_salary, add_role_department}) => {
            resolve([add_role_name, add_role_salary, add_role_department]);
        });
    });
};

// add role to database
async function addRole(response_array) {
    // const db = mysql.createConnection(config);
    await db.promise().query(`    
    INSERT INTO role (title, salary, department_id)
    VALUES ("${response_array[0]}", ${response_array[1]}, ${response_array[2]});`)
    .then(([rows]) => {
        console.table(`\nadded ${response_array[0]} to the database`);
    })
    .catch(error => {
        throw error;
    });
};

// return list of departments for use in inquirer prompt
async function getDepartments() {
    return new Promise((resolve, reject) => {
        // const db = mysql.createConnection(config);
        db.query(`
        SELECT name
        FROM department;`, (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
}

async function deptNameByID(department_name) {
    return new Promise((resolve, reject) => {
        // const db = mysql.createConnection(config);
        db.query(`
        SELECT id
        FROM department
        WHERE name="${department_name}";`, (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
}







// inquirer calls for adding an employee
async function addEmployeeInquirer() {
    var role_choices = await getRoles();
    let role_choices_list = [];
    role_choices.forEach((item, index) => {
        let {title: placeholder} = item;
        role_choices_list.push(placeholder)
    });



    var manager_choices = await getManager();
    console.log(manager_choices);
    let manager_choices_list = [];
    manager_choices.forEach((item, index) => {
        let {"concat(first_name, ' ', last_name)": placeholder} = item;
        //let placeholder = placeholder_fn + " " + placeholder_ln
        role_choices_list.push(placeholder)
    });



    return new Promise( (resolve, reject) => {
        inquirer.prompt([
            {
                type: 'input',
                message: "what is the employee's first name?",
                name: 'add_employee_first_name',
            },
            {
                type: 'input',
                message: "what is the employee's last name?",
                name: 'add_employee_last_name',
            },
            {
                type: 'list',
                message: 'which department does the role belong to?',
                name: 'add_employee_role',
                choices: role_choices_list,
            }
            ,
            {
                type: 'list',
                message: "who is the employee's manager?",
                name: 'add_employee_manager',
                choices: manager_choices_list,
            }
        ]).then(({add_employee_first_name, add_employee_last_name, add_employee_role, add_employee_manager}) => {

            resolve([add_employee_first_name, add_employee_last_name, add_employee_role, add_employee_manager]);
        });
    });
};





// return list of roles for use in inquirer prompt
async function getRoles(db) {
    return new Promise((resolve, reject) => {
        // const db = mysql.createPool(config);
        db.query(`
        SELECT title
        FROM role;`, (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
}


// return list of managers for use in inquirer prompt
async function getManager(db) {
    return new Promise((resolve, reject) => {
        // const db = mysql.createPool(config);
        db.query(`
        SELECT concat(first_name, ' ', last_name)
        FROM employee;`, (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
}














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
        const db = mysql.createPool(config);
        let role_array = await addRoleInquirer(db);
        let [{id: role_department_id}] = await deptNameByID(role_array[2]);
        role_array[1] = parseInt(role_array[1]);
        role_array[2] = role_department_id;
        await addRole(db, role_array);
        menu();
    }





    if (menu_option.menu_choice == 'add employee') {
        let employee_array = await addEmployeeInquirer();
        console.log(employee_array)
        menu();
    }




}


init()
