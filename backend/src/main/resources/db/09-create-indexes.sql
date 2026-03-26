-- =====================================================
-- 09 - CREATE PERFORMANCE INDEXES
-- =====================================================

USE gh_hms;

-- Users
CREATE INDEX IF NOT EXISTS idx_users_role_branch  ON users(role_id, primary_branch_id);
CREATE INDEX IF NOT EXISTS idx_users_status        ON users(is_active, is_locked);
CREATE INDEX IF NOT EXISTS idx_users_created_at    ON users(created_at);

-- User branch assignments
CREATE INDEX IF NOT EXISTS idx_uba_composite       ON user_branch_assignments(user_id, branch_id);
CREATE INDEX IF NOT EXISTS idx_uba_branch_primary  ON user_branch_assignments(branch_id, is_primary);

-- Activity log
CREATE INDEX IF NOT EXISTS idx_ual_user_date       ON user_activity_log(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_ual_action_date     ON user_activity_log(action, created_at);
CREATE INDEX IF NOT EXISTS idx_ual_module_date     ON user_activity_log(module, created_at);

-- Sessions
CREATE INDEX IF NOT EXISTS idx_us_active           ON user_sessions(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_us_expiry_active    ON user_sessions(expiry_time, is_active);

-- Branches
CREATE INDEX IF NOT EXISTS idx_branches_type_region ON branches(branch_type, region);
CREATE INDEX IF NOT EXISTS idx_branches_active       ON branches(is_active, branch_type);

