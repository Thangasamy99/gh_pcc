package com.hospital.security.model;

import com.hospital.auth.model.User;
import com.hospital.multibranch.model.Branch;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Entity
@Table(name = "patient_gate_entry")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "entry_id", unique = true, nullable = false)
    private String entryId;

    @Enumerated(EnumType.STRING)
    @Column(name = "person_type", nullable = false)
    private PersonType personType;

    @Column(name = "patient_name")
    private String patientName;

    private Integer age;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;

    private String address;
    private String city;

    @Enumerated(EnumType.STRING)
    @Column(name = "visit_type", nullable = false)
    private VisitType visitType;

    @Column(name = "department", nullable = false)
    private String department;

    @Column(name = "purpose_of_visit", columnDefinition = "TEXT")
    private String purposeOfVisit;

    @Builder.Default
    @Column(name = "is_emergency")
    private Boolean isEmergency = false;

    @Column(name = "known_illness")
    private String knownIllness;

    private String allergy;

    @Builder.Default
    @Column(name = "has_insurance")
    private Boolean hasInsurance = false;

    @Column(name = "entry_date", nullable = false)
    private LocalDate entryDate;

    @Column(name = "entry_time", nullable = false)
    private LocalTime entryTime;

    @Column(name = "registered_by", nullable = false)
    private String registeredBy;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private EntryStatus status;

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
        if (entryDate == null) entryDate = LocalDate.now();
        if (entryTime == null) entryTime = LocalTime.now();
        if (status == null) status = EntryStatus.PENDING;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
