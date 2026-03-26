package com.hospital.reception.dto;

import com.hospital.reception.model.PatientVitals;
import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PatientVitalsDTO {
    private Long id;
    private Long patientEntryId;
    private String entryId;
    private String patientName;
    private Double weightKg;
    private Double heightCm;
    private Double temperatureCelsius;
    private Integer pulseRateBpm;
    private Integer bloodPressureSystolic;
    private Integer bloodPressureDiastolic;
    private Integer respirationRate;
    private Integer oxygenSaturation;
    private PatientVitals.TriageStatus triageStatus;
    private String notes;
    private String recordedBy;
    private Long branchId;
    private LocalDateTime createdAt;
}
