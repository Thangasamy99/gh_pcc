package com.hospital.consultation.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreatePrescriptionRequest {
    private Long patientId;
    private Long doctorId;
    private Long branchId;
    private Long consultationId;
    private String notes;
}
