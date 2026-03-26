package com.hospital.user.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String staffId;
    private String phone;
    private String profilePhoto;
    private Long roleId;
    private String roleName;
    private String roleCode;
    private Long primaryBranchId;
    private String branchName;
    private Boolean isActive;
    private Boolean isLocked;
    private LocalDateTime lastLoginAt;
    private LocalDateTime createdAt;
}
