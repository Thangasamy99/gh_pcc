package com.hospital.consultation.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConsultationDTO {
    private Long id;
    private String consultationId;
    private String patientName;
    private String doctorName;
    private String branchName;
    private LocalDateTime consultationDate;
    private String symptoms;
    private String clinicalNotes;
}
