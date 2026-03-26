-- =====================================================
-- 08 - SEED SAMPLE DEPARTMENT STAFF (Buea Branch)
-- Password: Staff@123  (for all sample staff)
-- =====================================================

USE gh_hms;

SET @doctor_role_id      = (SELECT id FROM roles    WHERE role_code   = 'ROLE_DOCTOR');
SET @nurse_role_id       = (SELECT id FROM roles    WHERE role_code   = 'ROLE_NURSE');
SET @lab_tech_role_id    = (SELECT id FROM roles    WHERE role_code   = 'ROLE_LAB_TECH');
SET @pharmacist_role_id  = (SELECT id FROM roles    WHERE role_code   = 'ROLE_PHARMACIST');
SET @cashier_role_id     = (SELECT id FROM roles    WHERE role_code   = 'ROLE_CASHIER');
SET @receptionist_role_id= (SELECT id FROM roles    WHERE role_code   = 'ROLE_RECEPTIONIST');
SET @security_role_id    = (SELECT id FROM roles    WHERE role_code   = 'ROLE_SECURITY');
SET @buea_branch_id      = (SELECT id FROM branches WHERE branch_code = 'HOS-001');
SET @buea_admin_id       = (SELECT id FROM users    WHERE username    = 'admin.buea');
SET @staff_pwd           = '$2a$10$slYQmyNdgTY18LqVr.OD8Obu/7xeX1yz9p3Pk9Yjz0AUa1l6jqNW';  -- Staff@123

-- Sample Doctors
INSERT INTO users (username,email,password_hash,first_name,last_name,employee_id,phone,role_id,primary_branch_id,created_by,created_at) VALUES
('dr.mbella',    'dr.mbella@buea.pcc.cm',    @staff_pwd, 'Sarah',     'Mbella',   'DOC-0001','+237 677123001',@doctor_role_id,@buea_branch_id,@buea_admin_id,NOW()),
('dr.ndifor',    'dr.ndifor@buea.pcc.cm',    @staff_pwd, 'John',      'Ndifor',   'DOC-0002','+237 677123002',@doctor_role_id,@buea_branch_id,@buea_admin_id,NOW()),
('dr.ngwa',      'dr.ngwa@buea.pcc.cm',      @staff_pwd, 'Elizabeth', 'Ngwa',     'DOC-0003','+237 677123003',@doctor_role_id,@buea_branch_id,@buea_admin_id,NOW());

-- Sample Nurses
INSERT INTO users (username,email,password_hash,first_name,last_name,employee_id,phone,role_id,primary_branch_id,created_by,created_at) VALUES
('nurse.akono',  'nurse.akono@buea.pcc.cm',  @staff_pwd, 'Marie',     'Akono',    'NUR-0001','+237 677123004',@nurse_role_id,@buea_branch_id,@buea_admin_id,NOW()),
('nurse.efua',   'nurse.efua@buea.pcc.cm',   @staff_pwd, 'Paul',      'Efua',     'NUR-0002','+237 677123005',@nurse_role_id,@buea_branch_id,@buea_admin_id,NOW());

-- Sample Lab Technicians
INSERT INTO users (username,email,password_hash,first_name,last_name,employee_id,phone,role_id,primary_branch_id,created_by,created_at) VALUES
('lab.taku',     'lab.taku@buea.pcc.cm',     @staff_pwd, 'James',     'Taku',     'LAB-0001','+237 677123006',@lab_tech_role_id,@buea_branch_id,@buea_admin_id,NOW());

-- Sample Pharmacist
INSERT INTO users (username,email,password_hash,first_name,last_name,employee_id,phone,role_id,primary_branch_id,created_by,created_at) VALUES
('pharm.ngale',  'pharm.ngale@buea.pcc.cm',  @staff_pwd, 'Beatrice',  'Ngale',    'PHA-0001','+237 677123007',@pharmacist_role_id,@buea_branch_id,@buea_admin_id,NOW());

-- Sample Cashier
INSERT INTO users (username,email,password_hash,first_name,last_name,employee_id,phone,role_id,primary_branch_id,created_by,created_at) VALUES
('cash.enyi',    'cash.enyi@buea.pcc.cm',    @staff_pwd, 'Peter',     'Enyi',     'CAS-0001','+237 677123008',@cashier_role_id,@buea_branch_id,@buea_admin_id,NOW());

-- Sample Receptionist
INSERT INTO users (username,email,password_hash,first_name,last_name,employee_id,phone,role_id,primary_branch_id,created_by,created_at) VALUES
('reception.mbua','reception.mbua@buea.pcc.cm',@staff_pwd,'Christine','Mbua',     'REC-0001','+237 677123009',@receptionist_role_id,@buea_branch_id,@buea_admin_id,NOW());

-- Sample Security Guard
INSERT INTO users (username,email,password_hash,first_name,last_name,employee_id,phone,role_id,primary_branch_id,created_by,created_at) VALUES
('sec.motuba',   'sec.motuba@buea.pcc.cm',   @staff_pwd, 'David',     'Motuba',   'SEC-0001','+237 677123010',@security_role_id,@buea_branch_id,@buea_admin_id,NOW());

-- Assign all Buea staff to branch
INSERT INTO user_branch_assignments (user_id, branch_id, is_primary, assigned_by, assigned_at)
SELECT u.id, @buea_branch_id, TRUE, @buea_admin_id, NOW()
FROM users u
WHERE u.primary_branch_id = @buea_branch_id
  AND u.username NOT IN ('admin.buea');

