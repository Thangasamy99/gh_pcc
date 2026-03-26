package com.hospital.superadmin.dto.response;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ActivityResponse {
    private Long id;
    private Long userId;
    private String userName;
    private String action;
    private String module;
    private String resourceType;
    private String resourceId;
    private String status;
    private String ipAddress;
    private LocalDateTime createdAt;
    private String timeAgo;
}
