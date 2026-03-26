package com.hospital.common.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Year;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class SequenceGeneratorService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final ConcurrentHashMap<String, Object> locks = new ConcurrentHashMap<>();

    /**
     * Generate Staff ID: {BRANCH_CODE}-{ROLE_ABBR}-{SEQUENCE}
     * Example: BGH-REC-001
     */
    @Transactional
    public String generateStaffId(String branchCode, String roleAbbreviation) {
        String key = "STAFF-" + branchCode + "-" + roleAbbreviation;
        Object lock = locks.computeIfAbsent(key, k -> new Object());
        
        synchronized (lock) {
            String sql = "SELECT COUNT(*) FROM users WHERE staff_id LIKE ?";
            String pattern = branchCode + "-" + roleAbbreviation + "-%";
            Integer count = jdbcTemplate.queryForObject(sql, Integer.class, pattern);
            
            int nextNumber = (count == null ? 0 : count) + 1;
            return String.format("%s-%s-%03d", branchCode, roleAbbreviation, nextNumber);
        }
    }

    /**
     * Generate Patient ID: {BRANCH_CODE}-PAT-{SEQUENCE}
     * Example: BGH-PAT-001
     */
    @Transactional
    public String generatePatientId(String branchCode) {
        String key = "PATIENT-" + branchCode;
        Object lock = locks.computeIfAbsent(key, k -> new Object());
        
        synchronized (lock) {
            String sql = "SELECT COUNT(*) FROM patients WHERE patient_id LIKE ?";
            String pattern = branchCode + "-PAT-%";
            Integer count = jdbcTemplate.queryForObject(sql, Integer.class, pattern);
            
            int nextNumber = (count == null ? 0 : count) + 1;
            return String.format("%s-PAT-%03d", branchCode, nextNumber);
        }
    }

    /**
     * Generate Consultation ID: {BRANCH_CODE}-CONS-{YYYY}-{SEQUENCE}
     * Example: BGH-CONS-2026-001
     */
    @Transactional
    public String generateConsultationId(String branchCode) {
        String year = String.valueOf(Year.now().getValue());
        String key = "CONS-" + branchCode + "-" + year;
        Object lock = locks.computeIfAbsent(key, k -> new Object());
        
        synchronized (lock) {
            String sql = "SELECT COUNT(*) FROM consultations WHERE consultation_id LIKE ?";
            String pattern = branchCode + "-CONS-" + year + "-%";
            Integer count = jdbcTemplate.queryForObject(sql, Integer.class, pattern);
            
            int nextNumber = (count == null ? 0 : count) + 1;
            return String.format("%s-CONS-%s-%03d", branchCode, year, nextNumber);
        }
    }

    /**
     * Generate Prescription ID: {BRANCH_CODE}-RX-{YYYY}-{SEQUENCE}
     * Example: BGH-RX-2026-001
     */
    @Transactional
    public String generatePrescriptionId(String branchCode) {
        String year = String.valueOf(Year.now().getValue());
        String key = "RX-" + branchCode + "-" + year;
        Object lock = locks.computeIfAbsent(key, k -> new Object());
        
        synchronized (lock) {
            String sql = "SELECT COUNT(*) FROM prescriptions WHERE prescription_id LIKE ?";
            String pattern = branchCode + "-RX-" + year + "-%";
            Integer count = jdbcTemplate.queryForObject(sql, Integer.class, pattern);
            
            int nextNumber = (count == null ? 0 : count) + 1;
            return String.format("%s-RX-%s-%03d", branchCode, year, nextNumber);
        }
    }

    /**
     * Generate Lab Order ID: {BRANCH_CODE}-LAB-{YYYY}-{SEQUENCE}
     * Example: BGH-LAB-2026-001
     */
    @Transactional
    public String generateLabOrderId(String branchCode) {
        String year = String.valueOf(Year.now().getValue());
        String key = "LAB-" + branchCode + "-" + year;
        Object lock = locks.computeIfAbsent(key, k -> new Object());
        
        synchronized (lock) {
            String sql = "SELECT COUNT(*) FROM lab_orders WHERE lab_order_id LIKE ?";
            String pattern = branchCode + "-LAB-" + year + "-%";
            Integer count = jdbcTemplate.queryForObject(sql, Integer.class, pattern);
            
            int nextNumber = (count == null ? 0 : count) + 1;
            return String.format("%s-LAB-%s-%03d", branchCode, year, nextNumber);
        }
    }

    /**
     * Generate Invoice ID: {BRANCH_CODE}-INV-{YYYY}-{SEQUENCE}
     * Example: BGH-INV-2026-001
     */
    @Transactional
    public String generateInvoiceId(String branchCode) {
        String year = String.valueOf(Year.now().getValue());
        String key = "INV-" + branchCode + "-" + year;
        Object lock = locks.computeIfAbsent(key, k -> new Object());
        
        synchronized (lock) {
            String sql = "SELECT COUNT(*) FROM invoices WHERE invoice_id LIKE ?";
            String pattern = branchCode + "-INV-" + year + "-%";
            Integer count = jdbcTemplate.queryForObject(sql, Integer.class, pattern);
            
            int nextNumber = (count == null ? 0 : count) + 1;
            return String.format("%s-INV-%s-%03d", branchCode, year, nextNumber);
        }
    }

    /**
     * Generate Receipt ID: {BRANCH_CODE}-REC-{YYYY}-{SEQUENCE}
     * Example: BGH-REC-2026-001
     */
    @Transactional
    public String generateReceiptId(String branchCode) {
        String year = String.valueOf(Year.now().getValue());
        String key = "REC-" + branchCode + "-" + year;
        Object lock = locks.computeIfAbsent(key, k -> new Object());
        
        synchronized (lock) {
            // We use the payments table for receipts
            String sql = "SELECT COUNT(*) FROM payments WHERE receipt_number LIKE ?";
            String pattern = branchCode + "-REC-" + year + "-%";
            Integer count = jdbcTemplate.queryForObject(sql, Integer.class, pattern);
            
            int nextNumber = (count == null ? 0 : count) + 1;
            return String.format("%s-REC-%s-%03d", branchCode, year, nextNumber);
        }
    }

    /**
     * Generate Admission ID: {BRANCH_CODE}-ADM-{YYYY}-{SEQUENCE}
     * Example: BGH-ADM-2026-001
     */
    @Transactional
    public String generateAdmissionId(String branchCode) {
        String year = String.valueOf(Year.now().getValue());
        String key = "ADM-" + branchCode + "-" + year;
        Object lock = locks.computeIfAbsent(key, k -> new Object());
        
        synchronized (lock) {
            String sql = "SELECT COUNT(*) FROM admissions WHERE admission_id LIKE ?";
            String pattern = branchCode + "-ADM-" + year + "-%";
            Integer count = jdbcTemplate.queryForObject(sql, Integer.class, pattern);
            
            int nextNumber = (count == null ? 0 : count) + 1;
            return String.format("%s-ADM-%s-%03d", branchCode, year, nextNumber);
        }
    }
}
