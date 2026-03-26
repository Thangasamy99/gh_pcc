package com.hospital.branchadmin.controller;

import com.hospital.branchadmin.dto.BranchAdminDashboardDTO;
import com.hospital.branchadmin.service.api.BranchAdminService;
import com.hospital.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/v1/branch-admin")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Branch Admin", description = "Endpoints for Hospital Branch Administration")
@PreAuthorize("hasRole('BRANCH_ADMIN') or hasRole('SUPER_ADMIN')")
public class BranchAdminController {

    private final BranchAdminService branchAdminService;

    // ================= DASHBOARD =================
    @GetMapping("/dashboard/{branchId}")
    @Operation(summary = "Get branch admin dashboard statistics")
    public ResponseEntity<ApiResponse<BranchAdminDashboardDTO>> getDashboard(@PathVariable Long branchId) {
        log.info("Fetching dashboard for branch: {}", branchId);
        return ResponseEntity.ok(ApiResponse.success(branchAdminService.getDashboard(branchId)));
    }

    // ================= PATIENT FLOW =================
    @GetMapping("/patients/track/{branchId}")
    @Operation(summary = "Track patient flow across all stages")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> trackPatients(@PathVariable Long branchId) {
        return ResponseEntity.ok(ApiResponse.success(branchAdminService.trackPatients(branchId)));
    }

    @GetMapping("/queues/{branchId}")
    @Operation(summary = "Get live queue status for all departments")
    public ResponseEntity<ApiResponse<Map<String, Integer>>> getQueues(@PathVariable Long branchId) {
        return ResponseEntity.ok(ApiResponse.success(branchAdminService.getQueues(branchId)));
    }

    // ================= USER MANAGEMENT =================
    @GetMapping("/staff/{branchId}")
    @Operation(summary = "Get all staff members in the branch")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getStaff(@PathVariable Long branchId) {
        return ResponseEntity.ok(ApiResponse.success(branchAdminService.getStaff(branchId)));
    }

    @GetMapping("/doctors/{branchId}")
    @Operation(summary = "Get doctor availability and status")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getDoctors(@PathVariable Long branchId) {
        return ResponseEntity.ok(ApiResponse.success(branchAdminService.getDoctors(branchId)));
    }

    // ================= OPERATIONS OVERVIEW =================
    @GetMapping("/operations/reception/{branchId}")
    @Operation(summary = "Get reception operations overview")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getReceptionOverview(@PathVariable Long branchId) {
        return ResponseEntity.ok(ApiResponse.success(branchAdminService.getReceptionOverview(branchId)));
    }

    @GetMapping("/operations/cashier/{branchId}")
    @Operation(summary = "Get cashier operations overview")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCashierOverview(@PathVariable Long branchId) {
        return ResponseEntity.ok(ApiResponse.success(branchAdminService.getCashierOverview(branchId)));
    }

    @GetMapping("/operations/doctor/{branchId}")
    @Operation(summary = "Get doctor operations overview")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDoctorOverview(@PathVariable Long branchId) {
        return ResponseEntity.ok(ApiResponse.success(branchAdminService.getDoctorOverview(branchId)));
    }

    // ================= MEDICAL SERVICES =================
    @GetMapping("/services/lab/{branchId}")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getLabStatus(@PathVariable Long branchId) {
        return ResponseEntity.ok(ApiResponse.success(branchAdminService.getLabStatus(branchId)));
    }

    @GetMapping("/services/pharmacy/{branchId}")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getPharmacyStatus(@PathVariable Long branchId) {
        return ResponseEntity.ok(ApiResponse.success(branchAdminService.getPharmacyStatus(branchId)));
    }

    @GetMapping("/services/ward/{branchId}")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getWardStatus(@PathVariable Long branchId) {
        return ResponseEntity.ok(ApiResponse.success(branchAdminService.getWardStatus(branchId)));
    }

    // ================= REPORTS =================
    @GetMapping("/reports/daily/{branchId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDailySummary(@PathVariable Long branchId) {
        return ResponseEntity.ok(ApiResponse.success(branchAdminService.getDailySummary(branchId)));
    }

    @GetMapping("/reports/financial/{branchId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getFinancialReport(@PathVariable Long branchId) {
        return ResponseEntity.ok(ApiResponse.success(branchAdminService.getFinancialReport(branchId)));
    }
}
