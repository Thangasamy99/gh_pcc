package com.hospital.superadmin.dto.response;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {
    private Integer totalBranches;
    private Integer totalUsers;
    private Integer activeUsers;
    private Integer inactiveUsers;
    private Integer pendingApprovals;
    private Integer totalDoctors;
    private Integer totalNurses;
    private Integer totalPatients;
    private Double systemUptime;
    private Double storageUsed;
    private Integer activeSessions;
    private LocalDateTime lastUpdated;
}
