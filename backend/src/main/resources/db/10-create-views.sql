-- =====================================================
-- 10 - CREATE REPORTING VIEWS
-- =====================================================

USE gh_hms;

-- View: Staff count by branch and role
CREATE OR REPLACE VIEW vw_users_by_branch AS
SELECT
    b.id          AS branch_id,
    b.branch_name,
    b.branch_code,
    b.region,
    r.role_name,
    COUNT(u.id)   AS user_count
FROM branches b
CROSS JOIN roles r
LEFT JOIN users u ON u.primary_branch_id = b.id AND u.role_id = r.id AND u.is_active = TRUE
WHERE b.branch_type = 'HOSPITAL'
GROUP BY b.id, b.branch_name, b.branch_code, b.region, r.role_name
ORDER BY b.branch_name, r.role_name;

-- View: Branch summary with staff totals
CREATE OR REPLACE VIEW vw_branch_summary AS
SELECT
    b.id,
    b.branch_code,
    b.branch_name,
    b.city,
    b.region,
    b.phone,
    b.email,
    b.is_active,
    COUNT(DISTINCT u.id)                                                     AS total_staff,
    COUNT(DISTINCT CASE WHEN r.role_code IN ('ROLE_DOCTOR','ROLE_SENIOR_DOCTOR') THEN u.id END) AS doctors,
    COUNT(DISTINCT CASE WHEN r.role_code = 'ROLE_NURSE'       THEN u.id END) AS nurses,
    COUNT(DISTINCT CASE WHEN r.role_code = 'ROLE_LAB_TECH'    THEN u.id END) AS lab_techs,
    COUNT(DISTINCT CASE WHEN r.role_code = 'ROLE_PHARMACIST'  THEN u.id END) AS pharmacists,
    COUNT(DISTINCT CASE WHEN r.role_code = 'ROLE_RECEPTIONIST'THEN u.id END) AS receptionists,
    COUNT(DISTINCT CASE WHEN r.role_code = 'ROLE_CASHIER'     THEN u.id END) AS cashiers,
    COUNT(DISTINCT CASE WHEN r.role_code = 'ROLE_SECURITY'    THEN u.id END) AS security_guards
FROM branches b
LEFT JOIN users u ON u.primary_branch_id = b.id AND u.is_active = TRUE
LEFT JOIN roles r ON u.role_id = r.id
GROUP BY b.id, b.branch_code, b.branch_name, b.city, b.region, b.phone, b.email, b.is_active;

-- View: Full user details with role and branch
CREATE OR REPLACE VIEW vw_user_details AS
SELECT
    u.id,
    u.username,
    u.email,
    u.first_name,
    u.last_name,
    CONCAT(u.first_name, ' ', u.last_name) AS full_name,
    u.employee_id,
    u.phone,
    r.role_name,
    r.role_code,
    r.role_level,
    b.branch_name   AS primary_branch,
    b.branch_code,
    b.region,
    u.is_active,
    u.is_locked,
    u.is_password_expired,
    u.last_login_at,
    u.failed_attempts,
    u.created_at,
    CONCAT(cr.first_name, ' ', cr.last_name) AS created_by_name
FROM users u
JOIN  roles r  ON u.role_id = r.id
LEFT JOIN branches b  ON u.primary_branch_id = b.id
LEFT JOIN users cr ON u.created_by = cr.id;

-- View: Role permissions summary
CREATE OR REPLACE VIEW vw_role_permissions AS
SELECT
    r.role_name,
    r.role_code,
    r.role_level,
    p.module,
    p.permission_name,
    p.permission_code
FROM roles r
JOIN role_permissions rp ON r.id  = rp.role_id
JOIN permissions p        ON p.id  = rp.permission_id
ORDER BY r.role_level, p.module, p.permission_name;

-- View: Recent activity log
CREATE OR REPLACE VIEW vw_recent_activity AS
SELECT
    ual.id,
    CONCAT(u.first_name,' ',u.last_name) AS user_name,
    u.username,
    r.role_name,
    b.branch_name,
    ual.action,
    ual.module,
    ual.resource_type,
    ual.resource_id,
    ual.ip_address,
    ual.status,
    ual.created_at
FROM user_activity_log ual
JOIN  users u    ON ual.user_id = u.id
JOIN  roles r    ON u.role_id   = r.id
LEFT JOIN branches b ON u.primary_branch_id = b.id
ORDER BY ual.created_at DESC;

