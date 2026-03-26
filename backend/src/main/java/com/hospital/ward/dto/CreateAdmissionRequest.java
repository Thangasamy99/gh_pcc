package com.hospital.ward.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateAdmissionRequest {
    private Long patientId;
    private Long branchId;
    private Long admittedByUserId;
    private String reason;
}
