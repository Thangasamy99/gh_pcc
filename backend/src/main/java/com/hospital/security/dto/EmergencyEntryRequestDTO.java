package com.hospital.security.dto;

import com.hospital.security.model.Gender;

import lombok.Data;
import jakarta.validation.constraints.*;

@Data
public class EmergencyEntryRequestDTO {
    
    @NotBlank(message = "Patient name is required")
    private String patientName;
    
    private Integer approxAge;
    
    @NotNull(message = "Gender is required")
    private Gender gender;
    
    @NotBlank(message = "Emergency type is required")
    private String emergencyType;
    
    private String accompaniedBy;
    private String phoneNumber;
    private String arrivalTime;
    private String sendToDepartment;
    private String additionalInfo;
    
    @NotNull(message = "Branch ID is required")
    private Long branchId;
}
