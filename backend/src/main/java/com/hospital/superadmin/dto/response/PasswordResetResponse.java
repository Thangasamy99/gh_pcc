package com.hospital.superadmin.dto.response;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PasswordResetResponse {
    private Long userId;
    private String username;
    private String fullName;
    private String newPassword;
    private String message;
    private LocalDateTime resetAt;
    private String resetBy;
}
