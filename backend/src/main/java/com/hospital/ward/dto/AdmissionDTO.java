package com.hospital.ward.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdmissionDTO {
    private Long id;
    private String admissionId;
    private String patientName;
    private String branchName;
    private String admittedBy;
    private LocalDateTime admissionDate;
    private String status;
}
