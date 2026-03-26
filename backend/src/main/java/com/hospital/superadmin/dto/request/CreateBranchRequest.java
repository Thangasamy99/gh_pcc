package com.hospital.superadmin.dto.request;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateBranchRequest {
    @NotBlank(message = "Branch code is required")
    @Size(min = 3, max = 20, message = "Branch code must be between 3 and 20 characters")
    @Pattern(regexp = "^[A-Z0-9-]+$", message = "Branch code must contain only uppercase letters, numbers, and hyphens")
    private String branchCode;

    @NotBlank(message = "Branch name is required")
    @Size(min = 3, max = 100, message = "Branch name must be between 3 and 100 characters")
    private String branchName;

    @NotBlank(message = "Branch type is required")
    @Pattern(regexp = "HOSPITAL|CENTRAL_PHARMACY", message = "Branch type must be HOSPITAL or CENTRAL_PHARMACY")
    private String branchType;

    @NotBlank(message = "Address is required")
    @Size(max = 500, message = "Address cannot exceed 500 characters")
    private String address;

    @NotBlank(message = "City is required")
    @Size(max = 50, message = "City cannot exceed 50 characters")
    private String city;

    @NotBlank(message = "Region is required")
    @Size(max = 50, message = "Region cannot exceed 50 characters")
    private String region;

    @Pattern(regexp = "^\\+?[0-9\\s-]{8,20}$", message = "Invalid phone number format")
    private String phone;

    @Email(message = "Invalid email format")
    @Size(max = 100, message = "Email cannot exceed 100 characters")
    private String email;

    private String registrationNumber;
    private String taxId;

    @Past(message = "Established date must be in the past")
    private LocalDate establishedDate;
}
