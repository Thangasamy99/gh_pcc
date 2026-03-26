package com.hospital.multibranch.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateBranchRequest {

    @Size(min = 3, max = 100, message = "Branch name must be between 3 and 100 characters")
    private String branchName;

    @Size(max = 500, message = "Address cannot exceed 500 characters")
    private String address;

    @Size(max = 50, message = "City cannot exceed 50 characters")
    private String city;

    @Size(max = 50, message = "Region cannot exceed 50 characters")
    private String region;

    @Pattern(regexp = "^\\+?[0-9\\s-]{8,20}$", message = "Invalid phone number format")
    private String phone;

    @Email(message = "Invalid email format")
    @Size(max = 100, message = "Email cannot exceed 100 characters")
    private String email;

    @Size(max = 50, message = "Tax ID cannot exceed 50 characters")
    private String taxId;

    private Boolean isActive;
}
