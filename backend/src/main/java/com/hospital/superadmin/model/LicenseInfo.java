package com.hospital.superadmin.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "license_info")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LicenseInfo {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "license_key", unique = true, nullable = false)
    private String licenseKey;

    @Column(name = "licensed_to", nullable = false)
    private String licensedTo;

    @Column(name = "max_branches")
    private Integer maxBranches;

    @Column(name = "max_users")
    private Integer maxUsers;

    @Column(name = "issue_date")
    private LocalDate issueDate;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    @Enumerated(EnumType.STRING)
    private LicenseStatus status;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() { this.createdAt = LocalDateTime.now(); }

    public enum LicenseStatus { ACTIVE, EXPIRED, SUSPENDED }
}
