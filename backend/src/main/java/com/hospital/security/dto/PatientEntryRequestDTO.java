package com.hospital.security.dto;

import com.hospital.security.model.PersonType;
import com.hospital.security.model.Gender;
import com.hospital.security.model.VisitType;

import lombok.Data;
import jakarta.validation.constraints.*;

@Data
public class PatientEntryRequestDTO {
    
    @NotNull(message = "Person type is required")
    private PersonType personType;
    
    private String patientName;
    private Integer age;
    private Gender gender;
    private String phoneNumber;
    private String address;
    private String city;
    private java.time.LocalDate dateOfBirth;
    private String department;
    private String purposeOfVisit;
    private Boolean isEmergency;
    private String knownIllness;
    private String allergy;
    private Boolean hasInsurance;
    
    @NotNull(message = "Visit type is required")
    private VisitType visitType;
    
    private String direction;
    private String destinationDetails;
    
    @NotNull(message = "Branch ID is required")
    private Long branchId;
}
