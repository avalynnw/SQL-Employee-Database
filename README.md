# SQL-Employee-Database

## Description

This program is desinged to be able to interact with a database using SQL to store information about employees.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Questions](#questions)

## Installation

Clone this project your personal computer using the command: 

	git clone git@github.com:avalynnw/SQL-Employee-Database

Then, use: 

	npm i

 to install the required dependencies in the root directory.

## Usage

Seed the database in mysql to start off with: 

    mysql -u root -p

in the root directory and enter the set password. 

Then, run

    source db/schema.sql
 
then run

    source db/seeds.sql

to seed the database. 

run 

    quit

to exit the sql shell.

Run the program from the root directory using:

	node index.js

and follow the promts to interact with the database.

![terminal screenshot of application](./assets/application.png)

### [Walkthrough Video](https://watch.screencastify.com/v/q5sQFUH5EZwKv4q2JG0w)

## Contributing

Collaborators: Avalynn Helgrave, https://github.com/avalynnw

Third-Party Assets: Modules: express, MySQL2, inquirer, console.table


## License

#### The Unlicense

[![License: Unlicense](https://img.shields.io/badge/license-Unlicense-blue.svg)](http://unlicense.org/)

http://unlicense.org/

## Questions

https://github.com/avalynnw

 Contact me at: avalynnjudge@gmail.com
