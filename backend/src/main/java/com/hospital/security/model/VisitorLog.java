package com.hospital.security.model;

import com.hospital.auth.model.User;
import com.hospital.multibranch.model.Branch;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Entity
@Table(name = "visitor_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VisitorLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "visitor_id", unique = true, nullable = false)
    private String visitorId;

    @Column(name = "visitor_name", nullable = false)
    private String visitorName;

    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;

    @Column(name = "national_id")
    private String nationalId;

    private String address;
    private String relationship;

    @Column(name = "patient_name")
    private String patientName;

    @Column(name = "ward_id")
    private Long wardId;

    @Column(name = "room_number")
    private String roomNumber;

    @Column(name = "bed_number")
    private String bedNumber;

    @Column(name = "visit_purpose", columnDefinition = "TEXT")
    private String visitPurpose;

    @Column(name = "entry_time", nullable = false)
    private LocalTime entryTime;

    @Column(name = "expected_exit_time")
    private LocalTime expectedExitTime;

    @Column(name = "exit_time")
    private LocalTime exitTime;

    @Column(name = "visitor_pass_number", unique = true)
    private String visitorPassNumber;

    @Column(name = "registered_by", nullable = false)
    private String registeredBy;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private VisitorStatus status;

    @ManyToOne
    @JoinColumn(name = "branch_id", nullable = false)
    private Branch branch;

    @ManyToOne
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (entryTime == null) entryTime = LocalTime.now();
        if (status == null) status = VisitorStatus.ACTIVE;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
