package com.hospital.superadmin.controller;

import com.hospital.common.dto.ApiResponse;
import com.hospital.superadmin.dto.request.*;
import com.hospital.superadmin.dto.response.*;
import com.hospital.superadmin.service.SuperAdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/v1/superadmin")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Super Admin", description = "Super Admin management APIs")
public class SuperAdminController {

    private final SuperAdminService superAdminService;

    // ==================== DASHBOARD APIs ====================

    @GetMapping("/dashboard/stats")
    @Operation(summary = "Get dashboard statistics")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getDashboardStats() {
        log.info("Fetching dashboard statistics");
        DashboardStatsResponse stats = superAdminService.getDashboardStats();
        return ResponseEntity.ok(new ApiResponse<>(true, "Success", stats));
    }

    @GetMapping("/dashboard/recent-activities")
    @Operation(summary = "Get recent activities")
    public ResponseEntity<ApiResponse<List<ActivityResponse>>> getRecentActivities(
            @RequestParam(defaultValue = "10") int limit) {
        log.info("Fetching {} recent activities", limit);
        List<ActivityResponse> activities = superAdminService.getRecentActivities(limit);
        return ResponseEntity.ok(new ApiResponse<>(true, "Success", activities));
    }

    @GetMapping("/dashboard/system-health")
    @Operation(summary = "Get system health metrics")
    public ResponseEntity<ApiResponse<SystemHealthResponse>> getSystemHealth() {
        log.info("Fetching system health metrics");
        SystemHealthResponse health = superAdminService.getSystemHealth();
        return ResponseEntity.ok(new ApiResponse<>(true, "Success", health));
    }

    @GetMapping("/dashboard/user-activity")
    @Operation(summary = "Get user activity overview")
    public ResponseEntity<ApiResponse<UserActivityResponse>> getUserActivity(
            @RequestParam(required = false, defaultValue = "today") String range) {
        log.info("Fetching user activity for range: {}", range);
        UserActivityResponse activity = superAdminService.getUserActivity(range);
        return ResponseEntity.ok(new ApiResponse<>(true, "Success", activity));
    }

    @GetMapping("/dashboard/revenue")
    @Operation(summary = "Get revenue overview")
    public ResponseEntity<ApiResponse<RevenueResponse>> getRevenueOverview(
            @RequestParam(required = false, defaultValue = "month") String period) {
        log.info("Fetching revenue overview for period: {}", period);
        RevenueResponse revenue = superAdminService.getRevenueOverview(period);
        return ResponseEntity.ok(new ApiResponse<>(true, "Success", revenue));
    }

    // ==================== REPORT APIs ====================

    @GetMapping("/reports/branch-comparison")
    @Operation(summary = "Get branch comparison report")
    public ResponseEntity<ApiResponse<List<BranchComparisonResponse>>> getBranchComparisonReport() {
        log.info("Generating branch comparison report");
        List<BranchComparisonResponse> report = superAdminService.getBranchComparisonReport();
        return ResponseEntity.ok(new ApiResponse<>(true, "Success", report));
    }

    @GetMapping("/reports/user-activity")
    @Operation(summary = "Get user activity report")
    public ResponseEntity<ApiResponse<List<UserActivityReportResponse>>> getUserActivityReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        log.info("Generating user activity report from {} to {}", startDate, endDate);
        List<UserActivityReportResponse> report = superAdminService.getUserActivityReport(startDate, endDate);
        return ResponseEntity.ok(new ApiResponse<>(true, "Success", report));
    }

    @GetMapping("/reports/export/{type}")
    @Operation(summary = "Export report")
    public ResponseEntity<byte[]> exportReport(
            @PathVariable String type,
            @RequestParam String format,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        log.info("Exporting {} report in {} format", type, format);
        byte[] data = superAdminService.exportReport(type, format, startDate, endDate);

        String filename = String.format("report_%s_%s.%s", type, LocalDateTime.now(), format);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentDispositionFormData("attachment", filename);

        MediaType mediaType = format.equalsIgnoreCase("pdf") ? MediaType.APPLICATION_PDF
                : MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(mediaType)
                .body(data);
    }

    // ==================== AUDIT LOG APIs ====================

    @GetMapping("/audit-logs")
    @Operation(summary = "Get audit logs")
    public ResponseEntity<ApiResponse<Page<AuditLogResponse>>> getAuditLogs(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String action,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        log.info("Fetching audit logs with filters");
        Page<AuditLogResponse> logs = superAdminService.getAuditLogs(userId, action, startDate, endDate, pageable);
        return ResponseEntity.ok(new ApiResponse<>(true, "Success", logs));
    }

    // ==================== SYSTEM SETTINGS APIs ====================

    @GetMapping("/settings")
    @Operation(summary = "Get system settings")
    public ResponseEntity<ApiResponse<SystemSettingsResponse>> getSystemSettings() {
        log.info("Fetching system settings");
        SystemSettingsResponse settings = superAdminService.getSystemSettings();
        return ResponseEntity.ok(new ApiResponse<>(true, "Success", settings));
    }

    @PutMapping("/settings")
    @Operation(summary = "Update system settings")
    public ResponseEntity<ApiResponse<SystemSettingsResponse>> updateSystemSettings(
            @Valid @RequestBody UpdateSystemSettingsRequest request) {
        log.info("Updating system settings");
        SystemSettingsResponse settings = superAdminService.updateSystemSettings(request, 1L);
        return ResponseEntity.ok(new ApiResponse<>(true, "Settings updated successfully", settings));
    }

    // ==================== BACKUP & RESTORE APIs ====================

    @PostMapping("/backup/create")
    @Operation(summary = "Create database backup")
    public ResponseEntity<ApiResponse<BackupResponse>> createBackup() {
        log.info("Creating database backup");
        BackupResponse backup = superAdminService.createBackup(1L);
        return ResponseEntity.ok(new ApiResponse<>(true, "Backup created successfully", backup));
    }

    @GetMapping("/backup/list")
    @Operation(summary = "List all backups")
    public ResponseEntity<ApiResponse<List<BackupResponse>>> listBackups() {
        log.info("Listing all backups");
        List<BackupResponse> backups = superAdminService.listBackups();
        return ResponseEntity.ok(new ApiResponse<>(true, "Success", backups));
    }

    @PostMapping("/backup/restore/{backupId}")
    @Operation(summary = "Restore from backup")
    public ResponseEntity<ApiResponse<Void>> restoreBackup(
            @PathVariable Long backupId) {
        log.info("Restoring backup with id: {}", backupId);
        superAdminService.restoreBackup(backupId, 1L);
        return ResponseEntity.ok(new ApiResponse<>(true, "Database restored successfully", null));
    }

    @DeleteMapping("/backup/{backupId}")
    @Operation(summary = "Delete backup")
    public ResponseEntity<ApiResponse<Void>> deleteBackup(
            @PathVariable Long backupId) {
        log.info("Deleting backup with id: {}", backupId);
        superAdminService.deleteBackup(backupId, 1L);
        return ResponseEntity.ok(new ApiResponse<>(true, "Backup deleted successfully", null));
    }
}
