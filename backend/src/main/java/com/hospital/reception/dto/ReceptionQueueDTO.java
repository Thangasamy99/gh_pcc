package com.hospital.reception.dto;

import com.hospital.reception.model.ReceptionQueue;
import com.hospital.security.model.VisitType;
import com.hospital.security.model.Gender;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.LocalTime;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ReceptionQueueDTO {
    private Long id;
    private Long patientEntryId;
    private String entryId;
    private String patientName;
    private Integer age;
    private Gender gender;
    private String phoneNumber;
    private VisitType visitType;
    private String department;
    private ReceptionQueue.QueueStatus queueStatus;
    private Integer queueNumber;
    private Boolean vitalsCompleted;
    private Boolean sentToCashier;
    private Boolean paymentCompleted;
    private String consultationRoom;
    private Long assignedDoctorId;
    private String assignedDoctorName;
    private Boolean sentToDoctor;
    private LocalDateTime queueTime;
    private LocalDateTime vitalsTime;
    private LocalDateTime cashierTime;
    private LocalDateTime doctorTime;
    private String notes;
    private String managedBy;
    private Long branchId;
    private LocalDate entryDate;
    private LocalTime entryTime;
    private LocalDateTime createdAt;
}
