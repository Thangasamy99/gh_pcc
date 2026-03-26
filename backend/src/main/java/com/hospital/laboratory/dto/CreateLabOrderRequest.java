package com.hospital.laboratory.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateLabOrderRequest {
    private Long patientId;
    private Long requestedByUserId;
    private Long branchId;
    private Long consultationId;
    private String priority;
}
