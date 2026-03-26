package com.hospital.superadmin.dto.response;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class SystemHealthResponse {
    private String databaseStatus;
    private String databaseLatency;
    private String cacheStatus;
    private String cacheHitRate;
    private String queueStatus;
    private Integer queueSize;
    private String totalDiskSpace;
    private String usedDiskSpace;
    private String freeDiskSpace;
    private Double diskUsagePercentage;
    private String totalMemory;
    private String usedMemory;
    private String freeMemory;
    private Double memoryUsagePercentage;
    private Double cpuUsage;
    private Integer cpuCores;
    private Double systemLoad;
    private String systemUptime;
    private LocalDateTime lastRestart;
    private LocalDateTime lastBackup;
    private String lastBackupStatus;
}
