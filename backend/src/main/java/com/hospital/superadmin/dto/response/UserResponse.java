package com.hospital.superadmin.dto.response;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String fullName;
    private String staffId;
    private String phone;
    private Long roleId;
    private String roleName;
    private String roleCode;
    private Long branchId;
    private String branchName;
    private String branchCode;
    private Boolean isActive;
    private Boolean isLocked;
    private Boolean isPasswordExpired;
    private LocalDateTime lastLoginAt;
    private String lastLoginIp;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String temporaryPassword;
}
