package com.hospital.security.dto;

import lombok.Data;
import jakarta.validation.constraints.*;

@Data
public class VisitorRequestDTO {
    
    @NotBlank(message = "Visitor name is required")
    private String visitorName;
    
    private String phoneNumber;
    private String nationalId;
    private String patientName;
    private String relationship;
    private String address;
    
    private Long wardId;
    private String roomNumber;
    private String bedNumber;
    
    private String visitPurpose;
    private String expectedExitTime;
    
    @NotNull(message = "Branch ID is required")
    private Long branchId;
}
