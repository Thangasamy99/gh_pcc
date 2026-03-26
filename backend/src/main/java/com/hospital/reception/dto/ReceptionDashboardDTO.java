package com.hospital.reception.dto;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ReceptionDashboardDTO {
    private Long totalPatientsToday;
    private Long waitingQueue;
    private Long vitalsCompleted;
    private Long sentToCashier;
    private Long paymentCompleted;
    private Long sentToDoctor;
    private Long emergencyCases;
    private Long normalCases;
    private Long urgentCases;
    private Long malePatients;
    private Long femalePatients;
    private Long otherGenderPatients;
    private Long consultationPatients;
    private Long followUpPatients;
    private Long emergencyPatients;
    private LocalDateTime lastUpdated;
}
