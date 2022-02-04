
UPDATE role 
    SET department_id = (
        SELECT name
        FROM department
        WHERE role.department_id = department.id
    );