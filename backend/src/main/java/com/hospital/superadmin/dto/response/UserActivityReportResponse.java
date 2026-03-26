package com.hospital.superadmin.dto.response;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UserActivityReportResponse {
    private Long userId;
    private String username;
    private String fullName;
    private Integer totalActions;
    private Integer uniqueActions;
    private LocalDateTime lastAction;
    private String mostFrequentAction;
}
