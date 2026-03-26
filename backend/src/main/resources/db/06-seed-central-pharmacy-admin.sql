-- =====================================================
-- 06 - SEED CENTRAL PHARMACY ADMIN
-- Password: Pharma@123
-- =====================================================

USE gh_hms;

SET @central_pharmacy_role_id   = (SELECT id FROM roles    WHERE role_code   = 'ROLE_CENTRAL_PHARMACY');
SET @central_pharmacy_branch_id = (SELECT id FROM branches WHERE branch_code = 'CPH-001');
SET @super_admin_id             = (SELECT id FROM users    WHERE username    = 'super.admin');

INSERT INTO users (
    username, email, password_hash,
    first_name, last_name, employee_id, phone,
    role_id, primary_branch_id,
    is_active, is_locked, is_password_expired,
    password_changed_at, created_by, created_at
) VALUES (
    'central.pharmacy',
    'central.pharmacy@pcc.cm',
    '$2a$10$8K1p/a0dR6F6A3I6tVxeHuU8pXChPjT/a7ZiPOJFaVjJGbKfJuvDm',  -- Pharma@123
    'Central', 'Pharmacy',
    'EMP-00002', '+237 672500626',
    @central_pharmacy_role_id,
    @central_pharmacy_branch_id,
    TRUE, FALSE, FALSE,
    NOW(), @super_admin_id, NOW()
);

-- Branch assignment
INSERT INTO user_branch_assignments (user_id, branch_id, is_primary, assigned_by, assigned_at)
VALUES (
    (SELECT id FROM users WHERE username = 'central.pharmacy'),
    @central_pharmacy_branch_id,
    TRUE, @super_admin_id, NOW()
);

-- Audit log
INSERT INTO user_activity_log (user_id, action, module, resource_type, resource_id, new_value, ip_address, status)
VALUES (
    @super_admin_id,
    'USER_CREATED', 'USER_MANAGEMENT', 'USER',
    (SELECT id FROM users WHERE username = 'central.pharmacy'),
    JSON_OBJECT('username','central.pharmacy','role','ROLE_CENTRAL_PHARMACY','branch','CPH-001'),
    '127.0.0.1', 'SUCCESS'
);

