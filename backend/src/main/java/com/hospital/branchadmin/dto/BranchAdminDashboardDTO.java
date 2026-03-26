package com.hospital.branchadmin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BranchAdminDashboardDTO {
    private Long totalPatientsToday;
    private Long waitingPatients;
    private Long paidPatients;
    private Long patientsInConsultation;
    private Long admissionsToday;
    private Double totalRevenueToday;
    
    // Quick Overview Stats
    private Map<String, Long> queueStatus; // e.g., "Reception": 10, "Cashier": 5
    private Map<String, Long> staffAvailability; // e.g., "Active Doctors": 4
    
    // Activity summaries
    private List<RecentPatientActivity> recentActivities;
}

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
class RecentPatientActivity {
    private String patientId;
    private String patientName;
    private String currentStage;
    private String status;
    private String time;
}
