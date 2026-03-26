package com.hospital.multibranch.dto.request;

import com.hospital.multibranch.model.Branch;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
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

    @NotNull(message = "Branch type is required")
    private Branch.BranchType branchType;

    @NotBlank(message = "Address is required")
    @Size(max = 500, message = "Address cannot exceed 500 characters")
    private String address;

    @NotBlank(message = "City is required")
    @Size(max = 50, message = "City cannot exceed 50 characters")
    private String city;

    @NotBlank(message = "Region is required")
    @Size(max = 50, message = "Region cannot exceed 50 characters")
    private String region;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^\\+?[0-9\\s-]{8,20}$", message = "Invalid phone number format")
    private String phone;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Size(max = 100, message = "Email cannot exceed 100 characters")
    private String email;

    @NotBlank(message = "Registration number is required")
    @Size(max = 50, message = "Registration number cannot exceed 50 characters")
    private String registrationNumber;

    @Size(max = 50, message = "Tax ID cannot exceed 50 characters")
    private String taxId;

    @NotNull(message = "Established date is required")
    @PastOrPresent(message = "Established date cannot be in the future")
    private LocalDate establishedDate;
}
