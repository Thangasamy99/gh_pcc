package com.hospital.superadmin.dto.response;
import lombok.Data;

@Data
public class BranchComparisonResponse {
    private Long branchId;
    private String branchName;
    private String branchCode;
    private String city;
    private String region;
    private Integer totalStaff;
    private Integer doctors;
    private Integer nurses;
    private Integer totalPatients;
    private Integer totalAppointments;
    private Double monthlyRevenue;
}
