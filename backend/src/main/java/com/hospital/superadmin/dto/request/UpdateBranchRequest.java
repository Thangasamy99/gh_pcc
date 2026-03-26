package com.hospital.superadmin.dto.request;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateBranchRequest {
    @Size(min = 3, max = 100, message = "Branch name must be between 3 and 100 characters")
    private String branchName;
    private String address;
    private String city;
    private String region;
    @Pattern(regexp = "^\\+?[0-9\\s-]{8,20}$", message = "Invalid phone number format")
    private String phone;
    @Email(message = "Invalid email format")
    private String email;
    private String taxId;
    private Boolean isActive;
}
