-- =====================================================
-- 03 - SEED ROLES AND PERMISSIONS
-- =====================================================

USE gh_hms;

-- -----------------------------------------------------
-- Roles
-- -----------------------------------------------------
INSERT INTO roles (role_name, role_code, description, role_level, is_system_role) VALUES
('SUPER_ADMIN',            'ROLE_SUPER_ADMIN',        'System Super Administrator - Full access across all branches',           1, TRUE),
('CENTRAL_PHARMACY_ADMIN', 'ROLE_CENTRAL_PHARMACY',   'Central Pharmacy Administrator - Manages master inventory',             2, TRUE),
('BRANCH_ADMIN',           'ROLE_BRANCH_ADMIN',        'Branch Administrator - Manages a specific hospital branch',            4, TRUE),
('SENIOR_DOCTOR',          'ROLE_SENIOR_DOCTOR',       'Senior Doctor / Department Head',                                      5, TRUE),
('DOCTOR',                 'ROLE_DOCTOR',              'General Practitioner / Specialist',                                    6, TRUE),
('NURSE',                  'ROLE_NURSE',               'Registered Nurse',                                                     6, TRUE),
('LAB_TECHNICIAN',         'ROLE_LAB_TECH',           'Laboratory Technician',                                                6, TRUE),
('RADIOLOGIST',            'ROLE_RADIOLOGIST',         'Radiology / Imaging Technician',                                       6, TRUE),
('PHARMACIST',             'ROLE_PHARMACIST',          'Branch Pharmacist',                                                    6, TRUE),
('RECEPTIONIST',           'ROLE_RECEPTIONIST',        'Front Desk Receptionist',                                              7, TRUE),
('CASHIER',                'ROLE_CASHIER',             'Billing and Cash Office Staff',                                        7, TRUE),
('SECURITY_GUARD',         'ROLE_SECURITY',            'Security Post Staff',                                                  7, TRUE),
('ACCOUNTANT',             'ROLE_ACCOUNTANT',          'Accountant',                                                           8, TRUE),
('HR_MANAGER',             'ROLE_HR_MANAGER',          'Human Resources Manager',                                              8, TRUE),
('STATISTICIAN',           'ROLE_STATISTICIAN',        'Data Analyst / Statistician',                                          8, TRUE);

-- -----------------------------------------------------
-- Permissions
-- -----------------------------------------------------
INSERT INTO permissions (permission_name, permission_code, module, description) VALUES
-- SUPER_ADMIN
('Create Branch',                  'CREATE_BRANCH',                'SUPER_ADMIN',     'Create new hospital branches'),
('Update Branch',                  'UPDATE_BRANCH',                'SUPER_ADMIN',     'Update branch information'),
('Delete Branch',                  'DELETE_BRANCH',                'SUPER_ADMIN',     'Delete/Deactivate branches'),
('View All Branches',              'VIEW_ALL_BRANCHES',            'SUPER_ADMIN',     'View all branches across system'),
('Create Branch Admin',            'CREATE_BRANCH_ADMIN',          'SUPER_ADMIN',     'Create Branch Administrator users'),
('Create Central Pharmacy Admin',  'CREATE_CENTRAL_PHARMACY_ADMIN','SUPER_ADMIN',     'Create Central Pharmacy Administrator'),
('View All Users',                 'VIEW_ALL_USERS',               'SUPER_ADMIN',     'View all users in system'),
('Reset Any Password',             'RESET_ANY_PASSWORD',           'SUPER_ADMIN',     'Reset password for any user'),
('View Audit Logs',                'VIEW_AUDIT_LOGS',              'SUPER_ADMIN',     'View system audit logs'),
('Manage System Settings',         'MANAGE_SYSTEM_SETTINGS',       'SUPER_ADMIN',     'Configure global system settings'),
-- CENTRAL_PHARMACY
('Manage Master Inventory',        'MANAGE_MASTER_INVENTORY',      'CENTRAL_PHARMACY','Add/Edit master drug catalog'),
('View Branch Stock Levels',       'VIEW_BRANCH_STOCK_LEVELS',     'CENTRAL_PHARMACY','Monitor stock levels across all branches'),
('Create Bulk Purchase Order',     'CREATE_BULK_PO',               'CENTRAL_PHARMACY','Create purchase orders for suppliers'),
('Approve Bulk Orders',            'APPROVE_BULK_ORDERS',          'CENTRAL_PHARMACY','Approve bulk purchase orders'),
('Allocate Stock to Branches',     'ALLOCATE_STOCK',               'CENTRAL_PHARMACY','Allocate inventory to hospital branches'),
('Manage Suppliers',               'MANAGE_SUPPLIERS',             'CENTRAL_PHARMACY','Add/Edit supplier information'),
('Track Expiry Dates',             'TRACK_EXPIRY',                 'CENTRAL_PHARMACY','Monitor and manage expiry dates'),
-- BRANCH_ADMIN
('Create Branch Users',            'CREATE_BRANCH_USERS',          'BRANCH_ADMIN',    'Create users within own branch'),
('Create Doctor',                  'CREATE_DOCTOR',                'BRANCH_ADMIN',    'Create doctor accounts'),
('Create Nurse',                   'CREATE_NURSE',                 'BRANCH_ADMIN',    'Create nurse accounts'),
('Create Lab Tech',                'CREATE_LAB_TECH',              'BRANCH_ADMIN',    'Create laboratory technician accounts'),
('Create Pharmacist',              'CREATE_PHARMACIST',            'BRANCH_ADMIN',    'Create pharmacist accounts'),
('Create Cashier',                 'CREATE_CASHIER',               'BRANCH_ADMIN',    'Create cashier accounts'),
('Create Receptionist',            'CREATE_RECEPTIONIST',          'BRANCH_ADMIN',    'Create receptionist accounts'),
('Create Security Guard',          'CREATE_SECURITY',              'BRANCH_ADMIN',    'Create security guard accounts'),
('View Branch Users',              'VIEW_BRANCH_USERS',            'BRANCH_ADMIN',    'View all users in own branch'),
('Deactivate Branch Users',        'DEACTIVATE_BRANCH_USERS',      'BRANCH_ADMIN',    'Deactivate users in own branch'),
('View Branch Reports',            'VIEW_BRANCH_REPORTS',          'BRANCH_ADMIN',    'View branch-specific reports'),
('Manage Branch Settings',         'MANAGE_BRANCH_SETTINGS',       'BRANCH_ADMIN',    'Configure branch settings'),
-- DOCTOR
('Create Consultation',            'CREATE_CONSULTATION',          'DOCTOR',          'Create new patient consultation'),
('View Patient History',           'VIEW_PATIENT_HISTORY',         'DOCTOR',          'View patient medical history'),
('Make Diagnosis',                 'MAKE_DIAGNOSIS',               'DOCTOR',          'Record diagnosis'),
('Prescribe Medication',           'PRESCRIBE_MEDICATION',         'DOCTOR',          'Prescribe drugs'),
('Request Lab Test',               'REQUEST_LAB_TEST',             'DOCTOR',          'Request laboratory tests'),
('Request Imaging',                'REQUEST_IMAGING',              'DOCTOR',          'Request imaging procedures'),
('View Lab Results',               'VIEW_LAB_RESULTS',             'DOCTOR',          'View laboratory test results'),
('View Imaging Results',           'VIEW_IMAGING_RESULTS',         'DOCTOR',          'View imaging results'),
('Refer Patient',                  'REFER_PATIENT',                'DOCTOR',          'Refer patient to specialist'),
('Admit Patient',                  'ADMIT_PATIENT',                'DOCTOR',          'Admit patient to ward'),
('Discharge Patient',              'DISCHARGE_PATIENT',            'DOCTOR',          'Discharge patient'),
-- NURSE
('Record Vital Signs',             'RECORD_VITAL_SIGNS',           'NURSE',           'Record patient vital signs'),
('Administer Treatment',           'ADMINISTER_TREATMENT',         'NURSE',           'Administer prescribed treatments'),
('Administer Medication',          'ADMINISTER_MEDICATION',        'NURSE',           'Administer medications'),
('View Assigned Patients',         'VIEW_ASSIGNED_PATIENTS',       'NURSE',           'View assigned patients'),
('Update Patient Status',          'UPDATE_PATIENT_STATUS',        'NURSE',           'Update patient status'),
('Record Intake Output',           'RECORD_INTAKE_OUTPUT',         'NURSE',           'Record fluid intake and output'),
-- LAB
('View Lab Requests',              'VIEW_LAB_REQUESTS',            'LAB',             'View pending lab requests'),
('Perform Lab Test',               'PERFORM_LAB_TEST',             'LAB',             'Perform laboratory tests'),
('Record Test Results',            'RECORD_TEST_RESULTS',          'LAB',             'Record test results'),
('Validate Results',               'VALIDATE_RESULTS',             'LAB',             'Validate test results'),
('Manage Lab Inventory',           'MANAGE_LAB_INVENTORY',         'LAB',             'Manage laboratory inventory'),
-- PHARMACY
('View Prescriptions',             'VIEW_PRESCRIPTIONS',           'PHARMACY',        'View pending prescriptions'),
('Dispense Medication',            'DISPENSE_MEDICATION',          'PHARMACY',        'Dispense prescribed medication'),
('Manage Branch Stock',            'MANAGE_BRANCH_STOCK',          'PHARMACY',        'Manage branch pharmacy stock'),
('Request Stock',                  'REQUEST_STOCK',                'PHARMACY',        'Request stock from central pharmacy'),
('Receive Stock',                  'RECEIVE_STOCK',                'PHARMACY',        'Receive stock from central pharmacy'),
('View Stock Alerts',              'VIEW_STOCK_ALERTS',            'PHARMACY',        'View low stock and expiry alerts'),
-- RECEPTION
('Register Patient',               'REGISTER_PATIENT',             'RECEPTION',       'Register new patients'),
('Schedule Appointment',           'SCHEDULE_APPOINTMENT',         'RECEPTION',       'Schedule patient appointments'),
('Check-in Patient',               'CHECKIN_PATIENT',              'RECEPTION',       'Check-in patients for appointments'),
('Verify Insurance',               'VERIFY_INSURANCE',             'RECEPTION',       'Verify patient insurance'),
('View Daily Schedule',            'VIEW_DAILY_SCHEDULE',          'RECEPTION',       'View daily appointment schedule'),
-- CASHIER
('Generate Invoice',               'GENERATE_INVOICE',             'CASHIER',         'Generate patient invoices'),
('Process Payment',                'PROCESS_PAYMENT',              'CASHIER',         'Process payments'),
('Issue Receipt',                  'ISSUE_RECEIPT',                'CASHIER',         'Issue payment receipts'),
('Process Refund',                 'PROCESS_REFUND',               'CASHIER',         'Process refunds'),
('View Daily Collections',         'VIEW_DAILY_COLLECTIONS',       'CASHIER',         'View daily collection summary'),
('Process Insurance Claim',        'PROCESS_INSURANCE_CLAIM',      'CASHIER',         'Process insurance claims'),
-- SECURITY
('Record Patient Arrival',         'RECORD_PATIENT_ARRIVAL',       'SECURITY',        'Record patient arrival'),
('Register Visitor',               'REGISTER_VISITOR',             'SECURITY',        'Register hospital visitors'),
('View Ward Directory',            'VIEW_WARD_DIRECTORY',          'SECURITY',        'View ward/bed directory'),
('Print Visitor Pass',             'PRINT_VISITOR_PASS',           'SECURITY',        'Print visitor passes'),
-- ACCOUNTING
('View Financial Reports',         'VIEW_FINANCIAL_REPORTS',       'ACCOUNTING',      'View financial reports'),
('Manage Vouchers',                'MANAGE_VOUCHERS',              'ACCOUNTING',      'Create and manage vouchers'),
('Post Journal Entries',           'POST_JOURNAL_ENTRIES',         'ACCOUNTING',      'Post journal entries'),
('Generate Balance Sheet',         'GENERATE_BALANCE_SHEET',       'ACCOUNTING',      'Generate balance sheet'),
('View Trial Balance',             'VIEW_TRIAL_BALANCE',           'ACCOUNTING',      'View trial balance'),
-- HR
('Manage Staff Records',           'MANAGE_STAFF_RECORDS',         'HR',              'Manage staff records'),
('Process Payroll',                'PROCESS_PAYROLL',              'HR',              'Process payroll'),
('Manage Leave',                   'MANAGE_LEAVE',                 'HR',              'Manage leave requests'),
('Track Attendance',               'TRACK_ATTENDANCE',             'HR',              'Track staff attendance'),
('Generate Payslips',              'GENERATE_PAYSLIPS',            'HR',              'Generate employee payslips'),
-- STATISTICS
('Generate Reports',               'GENERATE_REPORTS',             'STATISTICS',      'Generate statistical reports'),
('Export Data',                    'EXPORT_DATA',                  'STATISTICS',      'Export data to Excel/PDF'),
('View Analytics',                 'VIEW_ANALYTICS',               'STATISTICS',      'View analytics dashboard'),
('Create Custom Reports',          'CREATE_CUSTOM_REPORTS',        'STATISTICS',      'Create custom reports'),
-- COMMON
('View Own Profile',               'VIEW_OWN_PROFILE',             'COMMON',          'View own profile'),
('Update Own Profile',             'UPDATE_OWN_PROFILE',           'COMMON',          'Update own profile'),
('Change Own Password',            'CHANGE_OWN_PASSWORD',          'COMMON',          'Change own password');

-- -----------------------------------------------------
-- Assign Permissions to Roles
-- -----------------------------------------------------

-- SUPER_ADMIN â†’ all permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p WHERE r.role_code = 'ROLE_SUPER_ADMIN';

-- CENTRAL_PHARMACY_ADMIN
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.role_code = 'ROLE_CENTRAL_PHARMACY' AND p.module IN ('CENTRAL_PHARMACY','COMMON');

-- BRANCH_ADMIN
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.role_code = 'ROLE_BRANCH_ADMIN' AND p.module IN ('BRANCH_ADMIN','COMMON');

-- SENIOR_DOCTOR (all doctor permissions)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.role_code = 'ROLE_SENIOR_DOCTOR' AND p.module IN ('DOCTOR','COMMON');

-- DOCTOR
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.role_code = 'ROLE_DOCTOR' AND p.module IN ('DOCTOR','COMMON');

-- NURSE
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.role_code = 'ROLE_NURSE' AND p.module IN ('NURSE','COMMON');

-- LAB_TECHNICIAN
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.role_code = 'ROLE_LAB_TECH' AND p.module IN ('LAB','COMMON');

-- PHARMACIST
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.role_code = 'ROLE_PHARMACIST' AND p.module IN ('PHARMACY','COMMON');

-- RECEPTIONIST
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.role_code = 'ROLE_RECEPTIONIST' AND p.module IN ('RECEPTION','COMMON');

-- CASHIER
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.role_code = 'ROLE_CASHIER' AND p.module IN ('CASHIER','COMMON');

-- SECURITY_GUARD
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.role_code = 'ROLE_SECURITY' AND p.module IN ('SECURITY','COMMON');

-- ACCOUNTANT
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.role_code = 'ROLE_ACCOUNTANT' AND p.module IN ('ACCOUNTING','COMMON');

-- HR_MANAGER
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.role_code = 'ROLE_HR_MANAGER' AND p.module IN ('HR','COMMON');

-- STATISTICIAN
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.role_code = 'ROLE_STATISTICIAN' AND p.module IN ('STATISTICS','COMMON');

