package com.hospital.security.dto;

import lombok.Data;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

@Data
public class DynamicEntryRequestDTO {
    
    @NotBlank(message = "Entry type is required")
    private String entryType; // NORMAL, EMERGENCY, VISITOR
    
    // Common fields
    private String fullName;
    private String gender;
    private Integer age;
    private String phoneNumber;
    private String address;
    
    // Normal patient fields
    private String visitType;
    private String department;
    
    // Emergency fields
    private String emergencyType;
    private String conditionDescription;
    private String broughtBy;
    
    // Visitor fields
    private String visitorName;
    private String idProof;
    private String relationship;
    private String patientName;
    private Long patientId;
    private Long wardId;
    private String roomNumber;
    private String bedNumber;
    private String purposeOfVisit;
    private LocalDateTime expectedExitTime;
    
    @NotNull(message = "Branch ID is required")
    private Long branchId;
}
