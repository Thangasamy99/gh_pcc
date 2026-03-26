package com.hospital.security.dto;

import com.hospital.security.model.VisitorStatus;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Builder
public class VisitorResponseDTO {
    private Long id;
    private String visitorId;
    private String visitorName;
    private String phoneNumber;
    private String nationalId;
    private String address;
    private String relationship;
    private String patientName;
    private Long wardId;
    private String wardName;
    private String roomNumber;
    private String bedNumber;
    private String visitPurpose;
    private LocalTime entryTime;
    private LocalTime exitTime;
    private LocalTime expectedExitTime;
    private String visitorPassNumber;
    private VisitorStatus status;
    private Long branchId;
    private String branchName;
    private String registeredBy;
    private LocalDateTime createdAt;
}
