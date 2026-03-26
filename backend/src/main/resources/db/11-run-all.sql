-- =====================================================
-- 11 - MASTER RUN SCRIPT
-- Run this file to execute all scripts in sequence
-- Usage: mysql -u root -p < 11-run-all.sql
-- =====================================================

SOURCE 01-create-database.sql;
SOURCE 02-create-tables.sql;
SOURCE 03-seed-roles-permissions.sql;
SOURCE 04-seed-branches.sql;
SOURCE 05-seed-super-admin.sql;
SOURCE 06-seed-central-pharmacy-admin.sql;
SOURCE 07-seed-branch-admins.sql;
SOURCE 08-seed-sample-staff.sql;
SOURCE 09-create-indexes.sql;
SOURCE 10-create-views.sql;

-- ===================================================
-- VERIFICATION SUMMARY
-- ===================================================
USE gh_hms;

SELECT '=============================='    AS '';
SELECT 'DATABASE SETUP COMPLETE - PCC HMS' AS 'Status';
SELECT '=============================='    AS '';

SELECT CONCAT('Total Branches   : ', COUNT(*)) AS 'Summary' FROM branches;
SELECT CONCAT('Total Users      : ', COUNT(*)) AS 'Summary' FROM users;
SELECT CONCAT('Total Roles      : ', COUNT(*)) AS 'Summary' FROM roles;
SELECT CONCAT('Total Permissions: ', COUNT(*)) AS 'Summary' FROM permissions;

SELECT '' AS '';
SELECT 'USER BREAKDOWN BY ROLE:' AS '';
SELECT r.role_name, COUNT(u.id) AS user_count
FROM roles r
LEFT JOIN users u ON u.role_id = r.id
GROUP BY r.role_name, r.role_level
ORDER BY r.role_level;

SELECT '' AS '';
SELECT 'DEFAULT LOGIN CREDENTIALS:' AS '';
SELECT 'super.admin / Admin@123'        AS 'Super Admin';
SELECT 'central.pharmacy / Pharma@123'  AS 'Central Pharmacy Admin';
SELECT 'admin.buea / Branch@123'        AS 'Buea Branch Admin (sample)';
SELECT 'dr.mbella / Staff@123'          AS 'Doctor (sample)';
SELECT 'nurse.akono / Staff@123'        AS 'Nurse (sample)';

