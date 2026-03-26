package com.hospital.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDTO {

    private String accessToken;
    private String refreshToken;
    private String sessionId;
    private String tokenType;
    private long expiresIn;

    // User details
    private Long userId;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String fullName;
    private String staffId;
    private String phone;
    private String profilePhoto;

    // Role details
    private Long roleId;
    private String roleName;
    private String roleCode;

    // Branch details (null for super admin)
    private Long branchId;
    private String branchName;
    private String branchCode;

    // Flags
    private boolean isPasswordExpired;
    private boolean isActive;
}
