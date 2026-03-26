package com.hospital.security.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class EntryResponseDTO {
    private Long id;
    private String entryId;
    private String entryType;
    private String fullName;
    private String gender;
    private Integer age;
    private String phoneNumber;
    private String address;
    private String visitType;
    private String department;
    private String emergencyType;
    private String conditionDescription;
    private String broughtBy;
    private String visitorName;
    private String idProof;
    private String relationship;
    private String patientName;
    private Long patientId;
    private Long wardId;
    private String wardName;
    private String roomNumber;
    private String bedNumber;
    private String purposeOfVisit;
    private LocalDateTime entryTime;
    private LocalDateTime expectedExitTime;
    private LocalDateTime exitTime;
    private String status;
    private String registeredBy;
    private Long branchId;
    private String branchName;
    private String destination;
}
