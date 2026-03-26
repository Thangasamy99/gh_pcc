package com.hospital.security.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Year;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class SecuritySequenceGenerator {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final ConcurrentHashMap<String, AtomicInteger> counters = new ConcurrentHashMap<>();

    @Transactional
    public String generateEntryId(String branchCode) {
        String year = String.valueOf(Year.now().getValue());
        String key = branchCode + "-TEMP-" + year;
        
        AtomicInteger counter = counters.computeIfAbsent(key, k -> new AtomicInteger(0));
        
        synchronized (key.intern()) {
            String sql = "SELECT COUNT(*) FROM patient_gate_entry WHERE entry_id LIKE ?";
            String pattern = branchCode + "-TEMP-" + year + "-%";
            Integer count = jdbcTemplate.queryForObject(sql, Integer.class, pattern);
            
            int nextNumber = (count == null ? 0 : count) + 1;
            counter.set(nextNumber);
            
            return String.format("%s-TEMP-%s-%03d", branchCode, year, nextNumber);
        }
    }

    @Transactional
    public String generateVisitorId(String branchCode) {
        String year = String.valueOf(Year.now().getValue());
        String key = branchCode + "-VIS-" + year;
        
        AtomicInteger counter = counters.computeIfAbsent(key, k -> new AtomicInteger(0));
        
        synchronized (key.intern()) {
            String sql = "SELECT COUNT(*) FROM visitor_logs WHERE visitor_id LIKE ?";
            String pattern = branchCode + "-VIS-" + year + "-%";
            Integer count = jdbcTemplate.queryForObject(sql, Integer.class, pattern);
            
            int nextNumber = (count == null ? 0 : count) + 1;
            counter.set(nextNumber);
            
            return String.format("%s-VIS-%s-%03d", branchCode, year, nextNumber);
        }
    }
}
