// import and require dependancies
const express = require('express');
const mysql = require('mysql2');
const cTable = require('console.table');
const inquirer = require('inquirer');

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



// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: 'password666',
      database: 'employee_db'
    },
    console.log(`Connected to the classlist_db database.`)
);





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

    //console.log(menu_option);
    
    if (menu_option.menu_choice == 'view all employees') {
        db.query(`  SELECT 
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
                    ORDER BY id ASC`, function (err, results) {
            if (err) throw err;
            else{
                console.log("\n");
                console.table(results);
                menu();
            }
        });
    } 
    if (menu_option.menu_choice == 'view all roles') {
        db.query(`  SELECT 
                    r.id AS id, 
                    r.title AS title, 
                    d.name as department,
                    r.salary AS salary
                    FROM role r
                    JOIN department d on d.id = r.department_id
                    ORDER BY id ASC
                    `, function (err, results) {
            if (err) throw err;
            else{
                console.log("\n");
                console.table(results);
                menu();
            }
        });
    } 
    if (menu_option.menu_choice == 'view all departments') {
        db.query(`  SELECT * FROM department
                    ORDER BY id ASC;`, function (err, results) {
            if (err) throw err;
            else{
                console.log("\n");
                console.table(results);
                menu();
            }
        });
    } 
    if (menu_option.menu_choice == 'add department') {

        var department_input = await inquirer.prompt(add_department)

        //console.log(department_input.add_department_name);

        // db.promise().query(`    INSERT INTO department (name)
        //                         VALUES ("${department_input.add_department_name}");`)
        // .then( () => {              
        // console.table(`\nadded ${department_input.add_department_name} to the database`);
        // menu();
        // });

        db.query(`  INSERT INTO department (name)
                    VALUES ("${department_input.add_department_name}");`, function (err, results) {
            if (err) throw err;
            else{
                console.log(`\nadded ${department_input.add_department_name} to the database`);
                menu();
            }
        });



    } 
    else {
        console.log("menu_error")
        menu();
    }
}





init()
