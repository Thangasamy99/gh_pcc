-- =====================================================
-- SECURITY GUARD MODULE DATABASE TABLES
-- =====================================================

USE gh_hms;

-- ========== VISITOR LOGS TABLE ==========
CREATE TABLE IF NOT EXISTS visitor_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    visitor_id VARCHAR(50) UNIQUE NOT NULL,
    
    visitor_name VARCHAR(100) NOT NULL,
    visitor_phone VARCHAR(20),
    visitor_id_card VARCHAR(50),
    visitor_company VARCHAR(100),
    
    patient_name VARCHAR(100),
    patient_id BIGINT,
    relationship VARCHAR(50),
    
    ward_id BIGINT,
    room_number VARCHAR(20),
    bed_number VARCHAR(20),
    
    purpose_of_visit TEXT,
    entry_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    exit_time TIMESTAMP NULL,
    
    status ENUM('ACTIVE', 'COMPLETED', 'CANCELLED') DEFAULT 'ACTIVE',
    
    branch_id BIGINT NOT NULL,
    created_by BIGINT NOT NULL,
    
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_visitor_id (visitor_id),
    INDEX idx_visitor_status (status),
    INDEX idx_entry_time (entry_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========== PATIENT ENTRY RECORDS TABLE ==========
CREATE TABLE IF NOT EXISTS patient_entry_records (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    entry_id VARCHAR(50) UNIQUE NOT NULL,
    
    person_type ENUM('PATIENT', 'VISITOR', 'EMERGENCY', 'STAFF') NOT NULL,
    
    patient_name VARCHAR(100),
    patient_id BIGINT,
    
    visitor_name VARCHAR(100),
    visitor_id BIGINT,
    
    age INT,
    gender ENUM('MALE', 'FEMALE', 'OTHER'),
    phone_number VARCHAR(20),
    address TEXT,
    
    visit_type ENUM('OUTPATIENT', 'INPATIENT_VISIT', 'EMERGENCY', 'MATERNITY', 'LAB', 'PHARMACY') NOT NULL,
    
    direction VARCHAR(50) NOT NULL,
    destination_details TEXT,
    
    entry_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('PENDING', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING',
    
    branch_id BIGINT NOT NULL,
    created_by BIGINT NOT NULL,
    
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_entry_id (entry_id),
    INDEX idx_person_type (person_type),
    INDEX idx_status (status),
    INDEX idx_entry_time (entry_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========== WARDS TABLE ==========
CREATE TABLE IF NOT EXISTS wards (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    ward_code VARCHAR(20) UNIQUE NOT NULL,
    ward_name VARCHAR(100) NOT NULL,
    ward_type ENUM('MALE', 'FEMALE', 'MATERNITY', 'CHILDREN', 'ICU', 'PRIVATE') NOT NULL,
    total_beds INT NOT NULL,
    available_beds INT NOT NULL,
    occupied_beds INT NOT NULL,
    floor VARCHAR(20),
    branch_id BIGINT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_ward_code (ward_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========== ROOMS TABLE ==========
CREATE TABLE IF NOT EXISTS rooms (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    room_number VARCHAR(20) NOT NULL,
    ward_id BIGINT NOT NULL,
    room_type ENUM('GENERAL', 'PRIVATE', 'SHARED') DEFAULT 'GENERAL',
    total_beds INT NOT NULL,
    available_beds INT NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_room (ward_id, room_number),
    FOREIGN KEY (ward_id) REFERENCES wards(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========== BEDS TABLE ==========
CREATE TABLE IF NOT EXISTS beds (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    bed_number VARCHAR(20) NOT NULL,
    room_id BIGINT NOT NULL,
    ward_id BIGINT NOT NULL,
    status ENUM('AVAILABLE', 'OCCUPIED', 'MAINTENANCE') DEFAULT 'AVAILABLE',
    current_patient_id BIGINT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_bed (room_id, bed_number),
    FOREIGN KEY (room_id) REFERENCES rooms(id),
    FOREIGN KEY (ward_id) REFERENCES wards(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- SEED WARDS, ROOMS, BEDS FOR BUEA GENERAL HOSPITAL
-- =====================================================

-- Get Buea branch ID (Assuming BGH branch code exists)
SET @bgh_branch = (SELECT id FROM branches WHERE branch_code = 'BGH' LIMIT 1);

-- Insert Wards
INSERT IGNORE INTO wards (ward_code, ward_name, ward_type, total_beds, available_beds, occupied_beds, floor, branch_id) VALUES
('WARD-M-01', 'Male Ward', 'MALE', 20, 15, 5, '1st Floor', @bgh_branch),
('WARD-F-01', 'Female Ward', 'FEMALE', 20, 12, 8, '1st Floor', @bgh_branch),
('WARD-MAT-01', 'Maternity Ward', 'MATERNITY', 15, 8, 7, '2nd Floor', @bgh_branch),
('WARD-CH-01', 'Children Ward', 'CHILDREN', 15, 10, 5, '2nd Floor', @bgh_branch),
('WARD-ICU-01', 'Intensive Care Unit', 'ICU', 10, 3, 7, '3rd Floor', @bgh_branch),
('WARD-PR-01', 'Private Ward', 'PRIVATE', 10, 4, 6, '3rd Floor', @bgh_branch);

-- Get ward IDs
SET @male_ward = (SELECT id FROM wards WHERE ward_code = 'WARD-M-01' LIMIT 1);
SET @female_ward = (SELECT id FROM wards WHERE ward_code = 'WARD-F-01' LIMIT 1);
SET @maternity_ward = (SELECT id FROM wards WHERE ward_code = 'WARD-MAT-01' LIMIT 1);
SET @children_ward = (SELECT id FROM wards WHERE ward_code = 'WARD-CH-01' LIMIT 1);
SET @icu_ward = (SELECT id FROM wards WHERE ward_code = 'WARD-ICU-01' LIMIT 1);
SET @private_ward = (SELECT id FROM wards WHERE ward_code = 'WARD-PR-01' LIMIT 1);

-- Insert Rooms for Male Ward
INSERT IGNORE INTO rooms (room_number, ward_id, room_type, total_beds, available_beds) VALUES
('M-101', @male_ward, 'GENERAL', 4, 3),
('M-102', @male_ward, 'GENERAL', 4, 2),
('M-103', @male_ward, 'GENERAL', 4, 4),
('M-104', @male_ward, 'GENERAL', 4, 3),
('M-105', @male_ward, 'GENERAL', 4, 3);

-- Insert Rooms for Female Ward
INSERT IGNORE INTO rooms (room_number, ward_id, room_type, total_beds, available_beds) VALUES
('F-101', @female_ward, 'GENERAL', 4, 2),
('F-102', @female_ward, 'GENERAL', 4, 3),
('F-103', @female_ward, 'GENERAL', 4, 2),
('F-104', @female_ward, 'GENERAL', 4, 3),
('F-105', @female_ward, 'GENERAL', 4, 2);

-- Insert Rooms for Maternity Ward
INSERT IGNORE INTO rooms (room_number, ward_id, room_type, total_beds, available_beds) VALUES
('MAT-101', @maternity_ward, 'SHARED', 3, 2),
('MAT-102', @maternity_ward, 'SHARED', 3, 1),
('MAT-103', @maternity_ward, 'PRIVATE', 1, 1),
('MAT-104', @maternity_ward, 'PRIVATE', 1, 1),
('MAT-105', @maternity_ward, 'SHARED', 3, 3);

-- Get room IDs for Male Ward (for bed seeding)
SET @male_room_101 = (SELECT id FROM rooms WHERE room_number = 'M-101' AND ward_id = @male_ward LIMIT 1);
SET @male_room_102 = (SELECT id FROM rooms WHERE room_number = 'M-102' AND ward_id = @male_ward LIMIT 1);

-- Insert Beds for Male Ward Room 101
INSERT IGNORE INTO beds (bed_number, room_id, ward_id, status) VALUES
('M-101-A', @male_room_101, @male_ward, 'AVAILABLE'),
('M-101-B', @male_room_101, @male_ward, 'OCCUPIED'),
('M-101-C', @male_room_101, @male_ward, 'AVAILABLE'),
('M-101-D', @male_room_101, @male_ward, 'AVAILABLE');

-- Insert Beds for Male Ward Room 102
INSERT IGNORE INTO beds (bed_number, room_id, ward_id, status) VALUES
('M-102-A', @male_room_102, @male_ward, 'OCCUPIED'),
('M-102-B', @male_room_102, @male_ward, 'OCCUPIED'),
('M-102-C', @male_room_102, @male_ward, 'AVAILABLE'),
('M-102-D', @male_room_102, @male_ward, 'AVAILABLE');
