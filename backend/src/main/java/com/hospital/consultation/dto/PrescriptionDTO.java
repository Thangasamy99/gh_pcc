package com.hospital.consultation.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrescriptionDTO {
    private Long id;
    private String prescriptionId;
    private String patientName;
    private String doctorName;
    private String branchName;
    private LocalDateTime issueDate;
    private String status;
    private String notes;
}
