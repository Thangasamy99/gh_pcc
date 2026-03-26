package com.hospital.reception.model;

import com.hospital.auth.model.User;
import com.hospital.multibranch.model.Branch;
import com.hospital.security.model.PatientEntry;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "patient_vitals")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PatientVitals {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_entry_id", nullable = false)
    private PatientEntry patientEntry;

    @Column(name = "weight_kg")
    private Double weightKg;

    @Column(name = "height_cm")
    private Double heightCm;

    @Column(name = "temperature_celsius")
    private Double temperatureCelsius;

    @Column(name = "pulse_rate_bpm")
    private Integer pulseRateBpm;

    @Column(name = "blood_pressure_systolic")
    private Integer bloodPressureSystolic;

    @Column(name = "blood_pressure_diastolic")
    private Integer bloodPressureDiastolic;

    @Column(name = "respiration_rate")
    private Integer respirationRate;

    @Column(name = "oxygen_saturation")
    private Integer oxygenSaturation;

    @Enumerated(EnumType.STRING)
    @Column(name = "triage_status", nullable = false)
    private TriageStatus triageStatus;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recorded_by", nullable = false)
    private User recordedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    private Branch branch;

    @Builder.Default
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Builder.Default
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.triageStatus == null) this.triageStatus = TriageStatus.NORMAL;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public enum TriageStatus {
        NORMAL,
        URGENT,
        EMERGENCY
    }
}
