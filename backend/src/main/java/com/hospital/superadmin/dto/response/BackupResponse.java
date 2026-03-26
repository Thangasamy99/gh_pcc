package com.hospital.superadmin.dto.response;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class BackupResponse {
    private Long id;
    private String filename;
    private String filepath;
    private Long size;
    private String type;
    private String status;
    private String createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
}
