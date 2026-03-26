-- =====================================================
-- 04 - SEED BRANCHES
-- 1 Central Pharmacy + 16 Hospital Branches
-- =====================================================

USE gh_hms;

-- Central Pharmacy (ID 1)
INSERT INTO branches (branch_code, branch_name, branch_type, address, city, region, phone, email, registration_number, established_date) VALUES
('CPH-001', 'PCC Central Pharmacy', 'CENTRAL_PHARMACY', 'P.O. Box 19, Buea Road', 'Buea', 'South West',
 '+237 672500625', 'central.pharmacy@pcc.cm', 'PCC-CPH-1978-001', '1978-01-15');

-- 16 Hospital Branches
INSERT INTO branches (branch_code, branch_name, branch_type, address, city, region, phone, email, registration_number, established_date) VALUES
-- South West Region
('HOS-001','Buea General Hospital',       'HOSPITAL','P.O. Box 19, Molyko',         'Buea',        'South West','+237 677123456','buea.hospital@pcc.cm',       'PCC-HOS-1978-001','1978-03-20'),
('HOS-002','Limbe Regional Hospital',     'HOSPITAL','P.O. Box 72, Down Beach',      'Limbe',       'South West','+237 677123457','limbe.hospital@pcc.cm',      'PCC-HOS-1985-002','1985-06-12'),
('HOS-003','Kumba District Hospital',     'HOSPITAL','P.O. Box 105, Kumba Town',     'Kumba',       'South West','+237 677123458','kumba.hospital@pcc.cm',      'PCC-HOS-1990-003','1990-09-05'),
('HOS-004','Tiko Medical Center',         'HOSPITAL','P.O. Box 44, Tiko',            'Tiko',        'South West','+237 677123459','tiko.hospital@pcc.cm',       'PCC-HOS-1995-004','1995-02-18'),
-- Littoral Region
('HOS-005','Douala General Hospital',     'HOSPITAL','P.O. Box 1234, Bonanjo',       'Douala',      'Littoral',  '+237 677123460','douala.hospital@pcc.cm',     'PCC-HOS-1980-005','1980-11-22'),
('HOS-006','Bonaberi Medical Center',     'HOSPITAL','P.O. Box 567, Bonaberi',       'Douala',      'Littoral',  '+237 677123461','bonaberi.hospital@pcc.cm',   'PCC-HOS-2000-006','2000-04-15'),
('HOS-007','Nkongsamba Hospital',         'HOSPITAL','P.O. Box 89, Nkongsamba',      'Nkongsamba',  'Littoral',  '+237 677123462','nkongsamba.hospital@pcc.cm', 'PCC-HOS-1988-007','1988-07-30'),
-- Centre Region
('HOS-008','Yaounde Central Hospital',    'HOSPITAL','P.O. Box 2345, Mfoundi',       'Yaounde',     'Centre',    '+237 677123463','yaounde.hospital@pcc.cm',    'PCC-HOS-1979-008','1979-05-10'),
('HOS-009','Mbalmayo District Hospital',  'HOSPITAL','P.O. Box 67, Mbalmayo',        'Mbalmayo',    'Centre',    '+237 677123464','mbalmayo.hospital@pcc.cm',   'PCC-HOS-1992-009','1992-12-03'),
-- West Region
('HOS-010','Bafoussam Regional Hospital', 'HOSPITAL','P.O. Box 456, Bafoussam',      'Bafoussam',   'West',      '+237 677123465','bafoussam.hospital@pcc.cm',  'PCC-HOS-1982-010','1982-08-25'),
('HOS-011','Mbouda Hospital',             'HOSPITAL','P.O. Box 123, Mbouda',         'Mbouda',      'West',      '+237 677123466','mbouda.hospital@pcc.cm',     'PCC-HOS-1998-011','1998-03-14'),
-- North West Region
('HOS-012','Bamenda General Hospital',    'HOSPITAL','P.O. Box 789, Nkwen',          'Bamenda',     'North West','+237 677123467','bamenda.hospital@pcc.cm',    'PCC-HOS-1983-012','1983-09-19'),
('HOS-013','Kumbo District Hospital',     'HOSPITAL','P.O. Box 45, Kumbo',           'Kumbo',       'North West','+237 677123468','kumbo.hospital@pcc.cm',      'PCC-HOS-1993-013','1993-06-28'),
-- North Region
('HOS-014','Garoua Regional Hospital',   'HOSPITAL','P.O. Box 234, Garoua',         'Garoua',      'North',     '+237 677123469','garoua.hospital@pcc.cm',     'PCC-HOS-1987-014','1987-10-08'),
-- Adamawa Region
('HOS-015','Ngaoundere Medical Center',  'HOSPITAL','P.O. Box 567, Ngaoundere',     'Ngaoundere',  'Adamawa',   '+237 677123470','ngaoundere.hospital@pcc.cm', 'PCC-HOS-1996-015','1996-04-22'),
-- East Region
('HOS-016','Bertoua Hospital',           'HOSPITAL','P.O. Box 89, Bertoua',         'Bertoua',     'East',      '+237 677123471','bertoua.hospital@pcc.cm',    'PCC-HOS-1999-016','1999-11-15');

