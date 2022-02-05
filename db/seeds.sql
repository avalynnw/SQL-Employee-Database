INSERT INTO department (name)
VALUES  ("sales"),
        ("engineering"),
        ("finance"),
        ("legal");

INSERT INTO role (title, salary, department_id)
VALUES  ("sales lead", 35000, 001),
        ("salesperson", 32500, 001),
        ("lead engineer", 30000, 002),
        ("software engineer", 32500, 002),
        ("account manager", 50000, 003),
        ("accountant", 50000, 003),
        ("legal team lead", 50000, 004),
        ("lawyer", 50000, 004);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ("Daliborka", "Dumas", 001, null),
        ("Elise", "Michelakis", 002, 001),
        ("Réka", "Dermott", 003, null),
        ("Hjørdis", "Ibarra", 004, 003),
        ("Elin", "Rose", 005, null),
        ("Frosina", "Karimi", 006, 005),
        ("Auxentius", "Silva", 007, null),
        ("Svetla", "O'Connell", 008, 007);