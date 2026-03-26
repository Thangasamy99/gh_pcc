package com.hospital;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableAsync
@EnableScheduling
@ComponentScan(basePackages = "com.hospital")
public class HMSApplication {

    public static void main(String[] args) {
        SpringApplication.run(HMSApplication.class, args);
    }

    @Bean
    public static CommandLineRunner fixNullsInBranches(JdbcTemplate jdbcTemplate) {
        return args -> {
            try {
                System.out.println("--- DB DIAGNOSTIC START ---");
                Integer total = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM branches", Integer.class);
                System.out.println("Total branches in DB: " + total);

                int d = jdbcTemplate.update("UPDATE branches SET is_deleted = false WHERE is_deleted IS NULL");
                int a = jdbcTemplate.update("UPDATE branches SET is_active = true WHERE is_active IS NULL");
                int t = jdbcTemplate.update("UPDATE branches SET branch_type = 'HOSPITAL' WHERE branch_type IS NULL");

                System.out.println("Updated " + d + " rows for is_deleted");
                System.out.println("Updated " + a + " rows for is_active");
                System.out.println("Updated " + t + " rows for branch_type");

                System.out.println("--- TABLE AUDIT ---");
                String[] tables = {"users", "branches", "roles", "visitor_logs", "patient_gate_entry", "wards"};
                for (String table : tables) {
                    try {
                        Integer count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM " + table, Integer.class);
                        System.out.println("Table " + table + ": " + count + " rows");
                    } catch (Exception te) {
                        System.err.println("Table " + table + " check failed: " + te.getMessage());
                    }
                }

                System.out.println("--- BRANCH LIST ---");
                jdbcTemplate.query("SELECT id, branch_code, branch_name FROM branches", (rs, rowNum) -> {
                    System.out.println("Branch: ID=" + rs.getLong("id") + ", Code=" + rs.getString("branch_code") + ", Name=" + rs.getString("branch_name"));
                    return null;
                });
                System.out.println("--- DB DIAGNOSTIC END ---");
            } catch (Exception e) {
                System.err.println("Database diagnostic failed: " + e.getMessage());
            }
        };
    }
}
