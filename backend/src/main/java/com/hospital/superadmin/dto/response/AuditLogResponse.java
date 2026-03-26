package com.hospital.superadmin.dto.response;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AuditLogResponse {
    private Long id;
    private Long userId;
    private String userName;
    private String action;
    private String module;
    private String resourceType;
    private String resourceId;
    private String oldValue;
    private String newValue;
    private String status;
    private String errorMessage;
    private String ipAddress;
    private String userAgent;
    private LocalDateTime createdAt;
}
