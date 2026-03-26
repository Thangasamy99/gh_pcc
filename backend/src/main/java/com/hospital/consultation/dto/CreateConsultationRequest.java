package com.hospital.consultation.dto;

import java.time.LocalDateTime;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateConsultationRequest {
    private Long patientId;
    private Long doctorId;
    private Long branchId;
    private String symptoms;
    private String clinicalNotes;
    private String diagnosis;
    private String prescription;
    private String labRequestStatus;
    private String imagingRequestStatus;
    private Boolean followUpRequired;
    private LocalDateTime followUpDate;
}
