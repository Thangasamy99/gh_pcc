package com.hospital.branchadmin.service.api;

import com.hospital.branchadmin.dto.BranchAdminDashboardDTO;
import java.util.List;
import java.util.Map;

public interface BranchAdminService {
    BranchAdminDashboardDTO getDashboard(Long branchId);
    List<Map<String, Object>> trackPatients(Long branchId);
    Map<String, Integer> getQueues(Long branchId);
    List<Map<String, Object>> getStaff(Long branchId);
    List<Map<String, Object>> getDoctors(Long branchId);
    Map<String, Object> getReceptionOverview(Long branchId);
    Map<String, Object> getCashierOverview(Long branchId);
    Map<String, Object> getDoctorOverview(Long branchId);
    List<Map<String, Object>> getLabStatus(Long branchId);
    List<Map<String, Object>> getPharmacyStatus(Long branchId);
    List<Map<String, Object>> getWardStatus(Long branchId);
    Map<String, Object> getDailySummary(Long branchId);
    Map<String, Object> getFinancialReport(Long branchId);
}
