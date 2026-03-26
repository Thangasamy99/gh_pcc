-- =====================================================
-- 05 - SEED SUPER ADMIN USER
-- Password: Admin@123
-- BCrypt rounds: 10
-- =====================================================

USE gh_hms;

SET @super_admin_role_id = (SELECT id FROM roles WHERE role_code = 'ROLE_SUPER_ADMIN');

INSERT INTO users (
    username, email, password_hash,
    first_name, last_name, employee_id, phone,
    role_id, primary_branch_id,
    is_active, is_locked, is_password_expired,
    password_changed_at, created_by, created_at
) VALUES (
    'super.admin',
    'super.admin@pcc.cm',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',  -- Admin@123
    'System', 'Administrator',
    'EMP-00001', '+237 672500625',
    @super_admin_role_id,
    NULL,        -- Super Admin has no branch
    TRUE, FALSE, FALSE,
    NOW(), NULL, NOW()
);

-- Self-reference for created_by
SET @super_admin_id = (SELECT id FROM users WHERE username = 'super.admin');
UPDATE users SET created_by = @super_admin_id WHERE id = @super_admin_id;

-- Audit log entry
INSERT INTO user_activity_log (user_id, action, module, resource_type, resource_id, new_value, ip_address, status)
VALUES (
    @super_admin_id,
    'SUPER_ADMIN_CREATED', 'SYSTEM', 'USER', @super_admin_id,
    JSON_OBJECT('username','super.admin','role','SUPER_ADMIN','created_by','SYSTEM'),
    '127.0.0.1', 'SUCCESS'
);

