-- =====================================================
-- 07 - SEED BRANCH ADMINS FOR ALL 16 HOSPITALS
-- Password: Branch@123  (force change on first login)
-- =====================================================

USE gh_hms;

SET @branch_admin_role_id = (SELECT id FROM roles WHERE role_code = 'ROLE_BRANCH_ADMIN');
SET @super_admin_id       = (SELECT id FROM users WHERE username  = 'super.admin');

-- BCrypt hash for 'Branch@123'
SET @branch_pwd = '$2a$10$GRLdNijSQMUvl/au9ofL.eDwmoohzzS7.rmNWYy5svs1ZHBz0W8mS';

DELIMITER $$
CREATE PROCEDURE seed_branch_admins()
BEGIN
    DECLARE done        INT DEFAULT FALSE;
    DECLARE v_branch_id BIGINT;
    DECLARE v_code      VARCHAR(20);
    DECLARE v_city      VARCHAR(50);
    DECLARE v_uname     VARCHAR(50);
    DECLARE v_email     VARCHAR(100);
    DECLARE v_emp_id    VARCHAR(30);
    DECLARE v_new_id    BIGINT;

    DECLARE cur CURSOR FOR
        SELECT id, branch_code, city FROM branches WHERE branch_type = 'HOSPITAL';
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    OPEN cur;
    read_loop: LOOP
        FETCH cur INTO v_branch_id, v_code, v_city;
        IF done THEN LEAVE read_loop; END IF;

        SET v_uname   = CONCAT('admin.', LOWER(REPLACE(REPLACE(v_city,' ',''),'''','')));
        SET v_email   = CONCAT(v_uname, '@pcc.cm');
        SET v_emp_id  = CONCAT('EMP-', LPAD(v_branch_id + 100, 5, '0'));

        INSERT INTO users (
            username, email, password_hash,
            first_name, last_name, employee_id, phone,
            role_id, primary_branch_id,
            is_active, is_locked, is_password_expired,
            created_by, created_at
        ) VALUES (
            v_uname, v_email, @branch_pwd,
            CONCAT(v_city, ' Branch'), 'Admin',
            v_emp_id, '+237 677000000',
            @branch_admin_role_id, v_branch_id,
            TRUE, FALSE, TRUE,   -- force password change
            @super_admin_id, NOW()
        );

        SET v_new_id = LAST_INSERT_ID();

        INSERT INTO user_branch_assignments (user_id, branch_id, is_primary, assigned_by, assigned_at)
        VALUES (v_new_id, v_branch_id, TRUE, @super_admin_id, NOW());

        INSERT INTO user_activity_log (user_id, action, module, resource_type, resource_id, new_value, ip_address, status)
        VALUES (@super_admin_id, 'USER_CREATED', 'USER_MANAGEMENT', 'USER', v_new_id,
                JSON_OBJECT('username', v_uname, 'role','ROLE_BRANCH_ADMIN','branch_id', v_branch_id),
                '127.0.0.1', 'SUCCESS');
    END LOOP;
    CLOSE cur;
END$$
DELIMITER ;

CALL seed_branch_admins();
DROP PROCEDURE IF EXISTS seed_branch_admins;

