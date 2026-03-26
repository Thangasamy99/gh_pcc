package com.hospital.superadmin.dto.response;
import lombok.Data;

@Data
public class BranchStatsResponse {
    private Long branchId;
    private String branchName;
    private String branchCode;
    private Integer totalStaff;
    private Integer doctors;
    private Integer nurses;
    private Integer labTechnicians;
    private Integer pharmacists;
    private Integer receptionists;
    private Integer cashiers;
    private Integer administrators;
    private Integer totalPatients;
    private Integer activePatients;
    private Integer totalAdmissions;
    private Integer availableBeds;
    private Integer occupiedBeds;
    private Double bedOccupancyRate;
}
