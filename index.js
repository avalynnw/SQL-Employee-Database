// import and require dependancies
const express = require("express");
const mysql = require("mysql2");
const cTable = require("console.table");
const inquirer = require("inquirer");

const PORT = process.env.PORT || 3001;
const app = express();

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

var db = mysql.createPool({
  connectionLimit: 40,
  host: "localhost",
  // Your MySQL username
  user: "root",
  // Your MySQL password
  password: "password666",
  database: "employee_db",
});

// question lists
const menu_list = [
  {
    type: "list",
    message: "what would you like to do?",
    name: "menu_choice",
    choices: [
      "view all employees",
      "add employee",
      "update employee role",
      "view all roles",
      "add role",
      "view all departments",
      "add department",
      "quit",
    ],
  },
];

const add_department = [
  {
    type: "input",
    message: "what is the name of the department?",
    name: "add_department_name",
  },
];

// function to view employees
async function viewEmployees() {
  await db
    .promise()
    .query(
      `  
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
    ORDER BY id ASC`
    )
    .then(([rows]) => {
      console.log(" ");
      console.table(rows);
    })
    .catch((error) => {
      throw error;
    });
}

// function to view roles
async function viewRoles() {
  await db
    .promise()
    .query(
      `  
    SELECT 
    r.id AS id, 
    r.title AS title, 
    d.name as department,
    r.salary AS salary
    FROM role r
    JOIN department d on d.id = r.department_id
    ORDER BY id ASC
    `
    )
    .then(([rows]) => {
      console.log(" ");
      console.table(rows);
    })
    .catch((error) => {
      throw error;
    });
}

// function to view all departments
async function viewDepartments() {
  await db
    .promise()
    .query(
      `  
    SELECT * FROM department
    ORDER BY id ASC;`
    )
    .then(([rows]) => {
      console.log(" ");
      console.table(rows);
    })
    .catch((error) => {
      throw error;
    });
}

// function to add a department
async function addDepartment(input) {
  await db
    .promise()
    .query(
      `    
    INSERT INTO department (name)
    VALUES ("${input.add_department_name}");`
    )
    .then(([rows]) => {
      console.table(`\nadded ${input.add_department_name} to the database`);
    })
    .catch((error) => {
      throw error;
    });
}

// inquirer calls for adding a role
async function addRoleInquirer() {
  var department_choices = await getDepartments();
  let department_choices_list = [];
  department_choices.forEach((item, index) => {
    let { name: placeholder } = item;
    department_choices_list.push(placeholder);
  });
  return new Promise((resolve, reject) => {
    inquirer
      .prompt([
        {
          type: "input",
          message: "what is the name of the role?",
          name: "add_role_name",
        },
        {
          type: "input",
          message: "what is the salary of the role?",
          name: "add_role_salary",
        },
        {
          type: "list",
          message: "which department does the role belong to?",
          name: "add_role_department",
          choices: department_choices_list,
        },
      ])
      .then(({ add_role_name, add_role_salary, add_role_department }) => {
        resolve([add_role_name, add_role_salary, add_role_department]);
      });
  });
}

// add role to database
async function addRole(response_array) {
  await db
    .promise()
    .query(
      `    
    INSERT INTO role (title, salary, department_id)
    VALUES ("${response_array[0]}", ${response_array[1]}, ${response_array[2]});`
    )
    .then(([rows]) => {
      console.table(`\nadded ${response_array[0]} to the database`);
    })
    .catch((error) => {
      throw error;
    });
}

// return list of departments for use in inquirer prompt
async function getDepartments() {
  return new Promise((resolve, reject) => {
    db.query(
      `
        SELECT name
        FROM department;`,
      (err, res) => {
        if (err) reject(err);
        resolve(res);
      }
    );
  });
}

// return department id based on name
async function deptIDByName(department_name) {
  return new Promise((resolve, reject) => {
    db.query(
      `
        SELECT id
        FROM department
        WHERE name="${department_name}";`,
      (err, res) => {
        if (err) reject(err);
        resolve(res);
      }
    );
  });
}

// inquirer calls for adding an employee
async function addEmployeeInquirer() {
  var role_choices = await getRoles();
  let role_choices_list = [];
  role_choices.forEach((item, index) => {
    let { title: placeholder } = item;
    role_choices_list.push(placeholder);
  });

  var manager_choices = await getEmployee_list();
  let manager_choices_list = [];

  manager_choices_list.push("None");

  manager_choices.forEach((item, index) => {
    let { full_name: placeholder } = item;
    manager_choices_list.push(placeholder);
  });

  return new Promise((resolve, reject) => {
    inquirer
      .prompt([
        {
          type: "input",
          message: "what is the employee's first name?",
          name: "add_employee_first_name",
        },
        {
          type: "input",
          message: "what is the employee's last name?",
          name: "add_employee_last_name",
        },
        {
          type: "list",
          message: "whatis the employee's role?",
          name: "add_employee_role",
          choices: role_choices_list,
        },
        {
          type: "list",
          message: "who is the employee's manager?",
          name: "add_employee_manager",
          choices: manager_choices_list,
        },
      ])
      .then(
        ({
          add_employee_first_name,
          add_employee_last_name,
          add_employee_role,
          add_employee_manager,
        }) => {
          resolve([
            add_employee_first_name,
            add_employee_last_name,
            add_employee_role,
            add_employee_manager,
          ]);
        }
      );
  });
}

// return list of roles for use in inquirer prompt
async function getRoles() {
  return new Promise((resolve, reject) => {
    db.query(
      `
        SELECT title
        FROM role;`,
      (err, res) => {
        if (err) reject(err);
        resolve(res);
      }
    );
  });
}

// return list of managers for use in inquirer prompt
async function getEmployee_list() {
  return new Promise((resolve, reject) => {
    db.query(
      `
        SELECT concat(first_name, ' ', last_name)
        AS full_name
        FROM employee;`,
      (err, res) => {
        if (err) reject(err);
        resolve(res);
      }
    );
  });
}

// return an employee role id based on the title
async function employeeRoleIdByTitle(role_title) {
  return new Promise((resolve, reject) => {
    db.query(
      `
        SELECT id
        FROM role
        WHERE title="${role_title}";`,
      (err, res) => {
        if (err) reject(err);
        resolve(res);
      }
    );
  });
}

// return emplyee id give a first name
async function employeeEmployeeIdByFullName(full_name) {
  if (full_name == "None") {
    return "None";
  } else {
    var name_array = full_name.split(" ");
    return new Promise((resolve, reject) => {
      db.query(
        `
            SELECT id
            FROM employee
            WHERE first_name="${name_array[0]}"
            AND last_name="${name_array[1]}";`,
        (err, res) => {
          if (err) reject(err);
          resolve(res);
        }
      );
    });
  }
}

// add an employee
async function addEmployee(response_array) {
  if (response_array[3] == "None") {
    await db
      .promise()
      .query(
        `    
        INSERT INTO employee (first_name, last_name, role_id, manager_id)
        VALUES ("${response_array[0]}", "${response_array[1]}", ${response_array[2]}, null);`
      )
      .then(([rows]) => {
        console.table(
          `\nadded ${response_array[0]} ${response_array[1]} to the database`
        );
      })
      .catch((error) => {
        throw error;
      });
  } else {
    await db
      .promise()
      .query(
        `    
        INSERT INTO employee (first_name, last_name, role_id, manager_id)
        VALUES ("${response_array[0]}", "${response_array[1]}", ${response_array[2]}, ${response_array[3]});`
      )
      .then(([rows]) => {
        console.table(
          `\nadded ${response_array[0]} ${response_array[1]} to the database`
        );
      })
      .catch((error) => {
        throw error;
      });
  }
}

// inquirer prompts for updating emplyee role
async function updateEmployeeRoleInquirer() {
  var role_choices = await getRoles();
  let role_choices_list = [];
  role_choices.forEach((item, index) => {
    let { title: placeholder } = item;
    role_choices_list.push(placeholder);
  });

  var employee_list = await getEmployee_list();
  let employee_choices_list = [];
  employee_list.forEach((item, index) => {
    let { full_name: placeholder } = item;
    employee_choices_list.push(placeholder);
  });

  return new Promise((resolve, reject) => {
    inquirer
      .prompt([
        {
          type: "list",
          message: "which employee's role do you want to update?",
          name: "update_employee_full_name",
          choices: employee_choices_list,
        },
        {
          type: "list",
          message: "which role do you want to assign the selected employee?",
          name: "update_employee_new_role",
          choices: role_choices_list,
        },
      ])
      .then(({ update_employee_full_name, update_employee_new_role }) => {
        resolve([update_employee_full_name, update_employee_new_role]);
      });
  });
}

// updates employee using a response array
async function updateEmployeeRole(response_array) {
  await db
    .promise()
    .query(
      `    
    UPDATE employee 
    SET role_id = ${response_array[1]}
    WHERE id = ${response_array[0]};`
    )
    .then(([rows]) => {
      console.log(`updated employee's role`);
    })
    .catch((error) => {
      throw error;
    });
}

// initialize app
function init() {
  console.log(
    `%c
    ┌─┐┌┬┐┌─┐┬  ┌─┐┬ ┬┌─┐┌─┐  ┌┬┐┌─┐┌┬┐┌─┐┌┐ ┌─┐┌─┐┌─┐
    ├┤ │││├─┘│  │ │└┬┘├┤ ├┤    ││├─┤ │ ├─┤├┴┐├─┤└─┐├┤ 
    └─┘┴ ┴┴  ┴─┘└─┘ ┴ └─┘└─┘  ─┴┘┴ ┴ ┴ ┴ ┴└─┘┴ ┴└─┘└─┘
    `,
    `font-family: monospace`
  );

  menu();
}

// recursive looping menu function
async function menu() {
  let menu_option = await inquirer.prompt(menu_list);

  if (menu_option.menu_choice == "view all employees") {
    await viewEmployees();
    menu();
  }
  if (menu_option.menu_choice == "view all roles") {
    await viewRoles();
    menu();
  }
  if (menu_option.menu_choice == "view all departments") {
    await viewDepartments();
    menu();
  }
  if (menu_option.menu_choice == "add department") {
    var department_input = await inquirer.prompt(add_department);
    await addDepartment(department_input);
    menu();
  }
  if (menu_option.menu_choice == "add role") {
    let role_array = await addRoleInquirer();

    let [{ id: role_department_id }] = await deptIDByName(role_array[2]);
    role_array[1] = parseInt(role_array[1]);
    role_array[2] = role_department_id;

    await addRole(role_array);
    menu();
  }
  if (menu_option.menu_choice == "add employee") {
    let employee_array = await addEmployeeInquirer();

    let [{ id: employee_role_id }] = await employeeRoleIdByTitle(
      employee_array[2]
    );
    employee_array[2] = parseInt(employee_role_id);

    if (employee_array[3] == "None") {
      employee_array[3] == 0;
    } else {
      let [{ id: employee_manager_id }] = await employeeEmployeeIdByFullName(
        employee_array[3]
      );
      employee_array[3] = parseInt(employee_manager_id);
    }
    await addEmployee(employee_array);
    menu();
  }
  if (menu_option.menu_choice == "update employee role") {
    let employee_role_array = await updateEmployeeRoleInquirer();
    //console.log(employee_role_array);

    let [{ id: employee_id }] = await employeeEmployeeIdByFullName(
      employee_role_array[0]
    );
    employee_role_array[0] = parseInt(employee_id);

    let [{ id: employee_role_id }] = await employeeRoleIdByTitle(
      employee_role_array[1]
    );
    employee_role_array[1] = parseInt(employee_role_id);
    //console.log(employee_role_array)

    await updateEmployeeRole(employee_role_array);
    menu();
  }
  if (menu_option.menu_choice == "quit") {
    console.log("goodbye!");
    process.exit();
  }
}

// call initialize function
init();