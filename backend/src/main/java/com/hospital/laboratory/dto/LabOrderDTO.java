package com.hospital.laboratory.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LabOrderDTO {
    private Long id;
    private String labOrderId;
    private String patientName;
    private String requestedBy;
    private String branchName;
    private LocalDateTime orderDate;
    private String status;
    private String priority;
}
