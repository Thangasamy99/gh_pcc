package com.hospital.security.dto;

import com.hospital.security.model.PersonType;
import com.hospital.security.model.Gender;
import com.hospital.security.model.VisitType;
import com.hospital.security.model.EntryStatus;
import java.time.LocalDate;
import java.time.LocalTime;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class PatientEntryResponseDTO {
    private Long id;
    private String entryId;
    private PersonType personType;
    private String patientName;
    private Integer age;
    private Gender gender;
    private String phoneNumber;
    private String address;
    private String city;
    private VisitType visitType;
    private String department;
    private String purposeOfVisit;
    private Boolean isEmergency;
    private String knownIllness;
    private String allergy;
    private Boolean hasInsurance;
    private LocalDate entryDate;
    private LocalTime entryTime;
    private String registeredBy;
    private EntryStatus status;
    private Long branchId;
    private String branchName;
    private String createdBy;
    private LocalDateTime createdAt;
}
