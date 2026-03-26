package com.hospital.superadmin.service;

import com.hospital.superadmin.dto.request.*;
import com.hospital.superadmin.dto.response.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

public interface SuperAdminService {

    DashboardStatsResponse getDashboardStats();

    List<ActivityResponse> getRecentActivities(int limit);

    SystemHealthResponse getSystemHealth();

    UserActivityResponse getUserActivity(String range);

    RevenueResponse getRevenueOverview(String period);

    List<BranchResponse> getAllBranches();

    BranchResponse getBranchById(Long id);

    BranchResponse createBranch(CreateBranchRequest request, Long createdBy);

    BranchResponse updateBranch(Long id, UpdateBranchRequest request, Long updatedBy);

    void deleteBranch(Long id, boolean permanent, Long deletedBy);

    BranchStatsResponse getBranchStats(Long id);

    Page<UserResponse> getAllUsers(String role, Long branchId, Boolean active, Pageable pageable);

    UserResponse getUserById(Long id);

    UserResponse createBranchAdmin(CreateBranchAdminRequest request, Long createdBy);

    UserResponse createCentralPharmacyAdmin(CreateCentralPharmacyAdminRequest request, Long createdBy);

    UserResponse updateUser(Long id, UpdateUserRequest request, Long updatedBy);

    UserResponse toggleUserStatus(Long id, boolean active, Long updatedBy);

    PasswordResetResponse resetUserPassword(Long id, Long resetBy);

    List<RoleResponse> getAllRoles();

    List<PermissionResponse> getRolePermissions(Long roleId);

    void updateRolePermissions(Long roleId, List<Long> permissionIds, Long updatedBy);

    List<BranchComparisonResponse> getBranchComparisonReport();

    List<UserActivityReportResponse> getUserActivityReport(LocalDateTime startDate, LocalDateTime endDate);

    byte[] exportReport(String type, String format, LocalDateTime startDate, LocalDateTime endDate);

    Page<AuditLogResponse> getAuditLogs(Long userId, String action, LocalDateTime startDate,
            LocalDateTime endDate, Pageable pageable);

    SystemSettingsResponse getSystemSettings();

    SystemSettingsResponse updateSystemSettings(UpdateSystemSettingsRequest request, Long updatedBy);

    BackupResponse createBackup(Long createdBy);

    List<BackupResponse> listBackups();

    void restoreBackup(Long backupId, Long restoredBy);

    void deleteBackup(Long backupId, Long deletedBy);
}
