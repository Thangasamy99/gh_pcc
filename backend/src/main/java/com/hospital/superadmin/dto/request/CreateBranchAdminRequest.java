package com.hospital.superadmin.dto.request;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateBranchAdminRequest {
    @NotBlank(message = "Username is required")
    @Size(min = 4, max = 50, message = "Username must be between 4 and 50 characters")
    @Pattern(regexp = "^[a-zA-Z0-9._-]+$", message = "Username can only contain letters, numbers, dots, underscores and hyphens")
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Size(max = 100, message = "Email cannot exceed 100 characters")
    private String email;

    @Size(min = 8, message = "Password must be at least 8 characters")
    @Pattern.List({
        @Pattern(regexp = ".*[A-Z].*", message = "Password must contain at least one uppercase letter"),
        @Pattern(regexp = ".*[a-z].*", message = "Password must contain at least one lowercase letter"),
        @Pattern(regexp = ".*[0-9].*", message = "Password must contain at least one number"),
        @Pattern(regexp = ".*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?].*", 
                 message = "Password must contain at least one special character")
    })
    private String password;

    @NotBlank(message = "First name is required")
    private String firstName;
    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Staff ID is required")
    private String staffId;

    @Pattern(regexp = "^\\+?[0-9\\s-]{8,20}$", message = "Invalid phone number format")
    private String phone;

    @NotNull(message = "Branch ID is required")
    private Long branchId;

    private Boolean sendEmailNotification = true;
    private Boolean sendSmsNotification = false;
}
