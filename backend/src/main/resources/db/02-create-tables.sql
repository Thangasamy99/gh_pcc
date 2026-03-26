-- =====================================================
-- 02 - CREATE CORE TABLES
-- Hospital Management System
-- 16 Branches + 1 Central Pharmacy
-- =====================================================

USE gh_hms;

-- -----------------------------------------------------
-- Table: branches
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS branches (
    id                  BIGINT PRIMARY KEY AUTO_INCREMENT,
    branch_code         VARCHAR(20)  UNIQUE NOT NULL,
    branch_name         VARCHAR(100) NOT NULL,
    branch_type         ENUM('HOSPITAL','CENTRAL_PHARMACY') DEFAULT 'HOSPITAL',
    address             TEXT,
    city                VARCHAR(50),
    region              VARCHAR(50),
    phone               VARCHAR(20),
    email               VARCHAR(100),
    registration_number VARCHAR(50) UNIQUE,
    tax_id              VARCHAR(50),
    established_date    DATE,
    is_active           BOOLEAN DEFAULT TRUE,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_branch_code   (branch_code),
    INDEX idx_branch_city   (city),
    INDEX idx_branch_region (region)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table: roles
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS roles (
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    role_name       VARCHAR(50)  UNIQUE NOT NULL,
    role_code       VARCHAR(30)  UNIQUE NOT NULL,
    description     TEXT,
    role_level      INT          DEFAULT 1,
    is_system_role  BOOLEAN      DEFAULT FALSE,
    created_at      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_role_code (role_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table: permissions
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS permissions (
    id               BIGINT PRIMARY KEY AUTO_INCREMENT,
    permission_name  VARCHAR(100) UNIQUE NOT NULL,
    permission_code  VARCHAR(50)  UNIQUE NOT NULL,
    module           VARCHAR(50),
    description      TEXT,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_permission_code (permission_code),
    INDEX idx_permission_module (module)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table: role_permissions
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS role_permissions (
    role_id       BIGINT NOT NULL,
    permission_id BIGINT NOT NULL,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id)       REFERENCES roles(id)       ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table: users
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id                   BIGINT PRIMARY KEY AUTO_INCREMENT,
    username             VARCHAR(50)  UNIQUE NOT NULL,
    email                VARCHAR(100) UNIQUE NOT NULL,
    password_hash        VARCHAR(255) NOT NULL,
    first_name           VARCHAR(50)  NOT NULL,
    last_name            VARCHAR(50)  NOT NULL,
    employee_id          VARCHAR(30)  UNIQUE,
    phone                VARCHAR(20),
    profile_photo        VARCHAR(255),
    role_id              BIGINT NOT NULL,
    primary_branch_id    BIGINT,
    is_active            BOOLEAN   DEFAULT TRUE,
    is_locked            BOOLEAN   DEFAULT FALSE,
    is_password_expired  BOOLEAN   DEFAULT FALSE,
    last_login_at        TIMESTAMP NULL,
    last_login_ip        VARCHAR(45),
    failed_attempts      INT       DEFAULT 0,
    password_changed_at  TIMESTAMP NULL,
    created_by           BIGINT,
    created_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by           BIGINT,
    updated_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id)           REFERENCES roles(id),
    FOREIGN KEY (primary_branch_id) REFERENCES branches(id),
    FOREIGN KEY (created_by)        REFERENCES users(id),
    FOREIGN KEY (updated_by)        REFERENCES users(id),
    INDEX idx_users_username    (username),
    INDEX idx_users_email       (email),
    INDEX idx_users_employee_id (employee_id),
    INDEX idx_users_role        (role_id),
    INDEX idx_users_branch      (primary_branch_id),
    INDEX idx_users_active      (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table: user_branch_assignments
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS user_branch_assignments (
    user_id     BIGINT  NOT NULL,
    branch_id   BIGINT  NOT NULL,
    is_primary  BOOLEAN DEFAULT FALSE,
    assigned_by BIGINT,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, branch_id),
    FOREIGN KEY (user_id)     REFERENCES users(id)    ON DELETE CASCADE,
    FOREIGN KEY (branch_id)   REFERENCES branches(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES users(id),
    INDEX idx_uba_user   (user_id),
    INDEX idx_uba_branch (branch_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table: user_activity_log
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS user_activity_log (
    id               BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id          BIGINT       NOT NULL,
    action           VARCHAR(100) NOT NULL,
    module           VARCHAR(50),
    resource_type    VARCHAR(50),
    resource_id      VARCHAR(50),
    old_value        LONGTEXT,
    new_value        LONGTEXT,
    ip_address       VARCHAR(45),
    user_agent       TEXT,
    status           VARCHAR(20),
    error_message    TEXT,
    execution_time_ms INT,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_ual_user_id    (user_id),
    INDEX idx_ual_action     (action),
    INDEX idx_ual_module     (module),
    INDEX idx_ual_created_at (created_at),
    INDEX idx_ual_resource   (resource_type, resource_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table: user_sessions
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS user_sessions (
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id         BIGINT NOT NULL,
    session_token   VARCHAR(255) UNIQUE NOT NULL,
    refresh_token   VARCHAR(255) UNIQUE,
    ip_address      VARCHAR(45),
    user_agent      TEXT,
    device_info     TEXT,
    login_time      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expiry_time     TIMESTAMP,
    is_active       BOOLEAN DEFAULT TRUE,
    logout_time     TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_us_user_id       (user_id),
    INDEX idx_us_session_token (session_token),
    INDEX idx_us_refresh_token (refresh_token),
    INDEX idx_us_expiry        (expiry_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table: password_reset_tokens
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id         BIGINT NOT NULL,
    token           VARCHAR(255) UNIQUE NOT NULL,
    expiry_time     TIMESTAMP NOT NULL,
    used            BOOLEAN DEFAULT FALSE,
    used_at         TIMESTAMP NULL,
    created_by_ip   VARCHAR(45),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_prt_token   (token),
    INDEX idx_prt_user_id (user_id),
    INDEX idx_prt_expiry  (expiry_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

