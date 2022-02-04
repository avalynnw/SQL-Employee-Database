INSERT INTO department (name)
VALUES  ("Bioengineering"),
        ("Neurophysiology"),
        ("Mathematics"),
        ("Physics");

INSERT INTO role (title, salary, department_id)
VALUES  ("teacher", 35000, 001),
        ("teacher", 32500, 002),
        ("teacher", 30000, 003),
        ("teacher", 32500, 004),
        ("tenured teacher", 50000, 001),
        ("tenured teacher", 50000, 002),
        ("tenured teacher", 50000, 003),
        ("tenured teacher", 50000, 004),
        ("student instructor", 25000, 001),
        ("student instructor", 22500, 002),
        ("student instructor", 20000, 003),
        ("student instructor", 22500, 004),
        ("unpaid intern", 0, 001),
        ("unpaid intern", 0, 002),
        ("unpaid intern", 0, 003),
        ("unpaid intern", 0, 004);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ("Daliborka", "Dumas", 009, 006),
        ("Elise", "Michelakis", 003, null),
        ("Réka", "Dermott", 003, null),
        ("Hjørdis", "Ibarra", 008, 002),
        ("Elin", "Rose", 006, null),
        ("Frosina", "Karimi", 012, 003),
        ("Auxentius", "Silva", 007, 004),
        ("Svetla", "O'Connell", 013, 006);