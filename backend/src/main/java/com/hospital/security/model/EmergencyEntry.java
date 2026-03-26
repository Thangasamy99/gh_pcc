package com.hospital.security.model;

import com.hospital.auth.model.User;
import com.hospital.multibranch.model.Branch;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "emergency_entries")
public class EmergencyEntry {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "entry_id", unique = true, nullable = false)
    private String entryId;
    
    @Column(name = "patient_name", nullable = false)
    private String patientName;
    
    @Column(name = "approx_age")
    private Integer approxAge;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Gender gender;
    
    @Column(name = "emergency_type", nullable = false)
    private String emergencyType;
    
    @Column(name = "accompanied_by")
    private String accompaniedBy;
    
    @Column(name = "phone_number")
    private String phoneNumber;
    
    @Column(name = "arrival_time")
    private LocalTime arrivalTime;

    @Column(name = "entry_date")
    private java.time.LocalDate entryDate;

    @Column(name = "entry_time")
    private java.time.LocalTime entryTime;
    
    @Builder.Default
    @Column(name = "send_to_department")
    private String sendToDepartment = "EMERGENCY";
    
    @Column(name = "additional_info", columnDefinition = "TEXT")
    private String additionalInfo;
    
    @ManyToOne
    @JoinColumn(name = "branch_id", nullable = false)
    private Branch branch;
    
    @ManyToOne
    @JoinColumn(name = "registered_by", nullable = false)
    private User registeredBy;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (arrivalTime == null) {
            arrivalTime = LocalTime.now();
        }
    }
}
