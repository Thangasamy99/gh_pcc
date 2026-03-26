package com.hospital.multibranch.controller;

import com.hospital.common.dto.ApiResponse;
import com.hospital.multibranch.dto.request.CreateBranchRequest;
import com.hospital.multibranch.dto.request.UpdateBranchRequest;
import com.hospital.multibranch.dto.response.BranchResponse;
import com.hospital.multibranch.dto.response.BranchStatsResponse;
import com.hospital.multibranch.service.api.BranchService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/superadmin/branches")
@RequiredArgsConstructor
public class BranchController {

    private final BranchService branchService;

    // ========== GET ALL BRANCHES ==========
    @GetMapping
    public ResponseEntity<ApiResponse<List<BranchResponse>>> getAllBranches(
            @RequestParam(required = false, defaultValue = "false") Boolean includeDeleted) {
        return ResponseEntity.ok(ApiResponse.success(branchService.getAllBranches(includeDeleted)));
    }

    // ========== GET PAGINATED BRANCHES ==========
    @GetMapping("/paged")
    public ResponseEntity<ApiResponse<Page<BranchResponse>>> getBranchesPaginated(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String region,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String branchType,
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(required = false, defaultValue = "false") Boolean includeDeleted,
            @PageableDefault(size = 10, sort = "branchName", direction = Sort.Direction.ASC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(branchService.getBranchesPaginated(
                search, region, city, branchType, isActive, includeDeleted, pageable)));
    }

    // ========== GET BRANCH BY ID ==========
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BranchResponse>> getBranchById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(branchService.getBranchById(id)));
    }

    // ========== GET BRANCH BY ID INCLUDING DELETED ==========
    @GetMapping("/{id}/include-deleted")
    public ResponseEntity<ApiResponse<BranchResponse>> getBranchByIdIncludingDeleted(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(branchService.getBranchByIdIncludingDeleted(id)));
    }

    // ========== CREATE BRANCH ==========
    @PostMapping
    public ResponseEntity<ApiResponse<BranchResponse>> createBranch(
            @Valid @RequestBody CreateBranchRequest request,
            @RequestHeader("X-User-Id") Long userId) {
        return ResponseEntity.ok(ApiResponse.success(branchService.createBranch(request, userId)));
    }

    // ========== UPDATE BRANCH ==========
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<BranchResponse>> updateBranch(
            @PathVariable Long id,
            @Valid @RequestBody UpdateBranchRequest request,
            @RequestHeader("X-User-Id") Long userId) {
        return ResponseEntity.ok(ApiResponse.success(branchService.updateBranch(id, request, userId)));
    }

    // ========== SOFT DELETE BRANCH ==========
    @DeleteMapping("/{id}/soft")
    public ResponseEntity<ApiResponse<Void>> softDeleteBranch(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId) {
        branchService.softDeleteBranch(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Branch soft deleted successfully"));
    }

    // ========== RESTORE BRANCH ==========
    @PostMapping("/{id}/restore")
    public ResponseEntity<ApiResponse<Void>> restoreBranch(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId) {
        branchService.restoreBranch(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Branch restored successfully"));
    }

    // ========== PERMANENT DELETE BRANCH ==========
    @DeleteMapping("/{id}/permanent")
    public ResponseEntity<ApiResponse<Void>> permanentDeleteBranch(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId) {
        branchService.permanentDeleteBranch(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Branch permanently deleted successfully"));
    }

    // ========== BULK OPERATIONS ==========
    @PostMapping("/bulk/soft-delete")
    public ResponseEntity<ApiResponse<Void>> bulkSoftDelete(
            @RequestBody List<Long> ids,
            @RequestHeader("X-User-Id") Long userId) {
        branchService.bulkSoftDelete(ids, userId);
        return ResponseEntity.ok(ApiResponse.success("Bulk delete successful"));
    }

    @PostMapping("/bulk/restore")
    public ResponseEntity<ApiResponse<Void>> bulkRestore(
            @RequestBody List<Long> ids,
            @RequestHeader("X-User-Id") Long userId) {
        branchService.bulkRestore(ids, userId);
        return ResponseEntity.ok(ApiResponse.success("Bulk restore successful"));
    }

    // ========== GET BRANCH STATS ==========
    @GetMapping("/{id}/stats")
    public ResponseEntity<ApiResponse<BranchStatsResponse>> getBranchStats(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(branchService.getBranchStats(id)));
    }

    // ========== GET ALL BRANCHES STATS ==========
    @GetMapping("/stats/all")
    public ResponseEntity<ApiResponse<List<BranchStatsResponse>>> getAllBranchesStats() {
        return ResponseEntity.ok(ApiResponse.success(branchService.getAllBranchesStats()));
    }

    // ========== GET FILTERS DATA ==========
    @GetMapping("/filters/regions")
    public ResponseEntity<ApiResponse<List<String>>> getAllRegions() {
        return ResponseEntity.ok(ApiResponse.success(branchService.getAllRegions()));
    }

    @GetMapping("/filters/cities")
    public ResponseEntity<ApiResponse<List<String>>> getAllCities() {
        return ResponseEntity.ok(ApiResponse.success(branchService.getAllCities()));
    }

    // ========== CHECK UNIQUENESS ==========
    @GetMapping("/check-code")
    public ResponseEntity<ApiResponse<Boolean>> checkBranchCode(@RequestParam String code) {
        return ResponseEntity.ok(ApiResponse.success(branchService.checkBranchCode(code)));
    }

    @GetMapping("/check-name")
    public ResponseEntity<ApiResponse<Boolean>> checkBranchName(@RequestParam String name) {
        return ResponseEntity.ok(ApiResponse.success(branchService.checkBranchName(name)));
    }

    // ========== COUNTS ==========
    @GetMapping("/counts/active")
    public ResponseEntity<ApiResponse<Long>> countActiveBranches() {
        return ResponseEntity.ok(ApiResponse.success(branchService.countActiveBranches()));
    }

    @GetMapping("/counts/deleted")
    public ResponseEntity<ApiResponse<Long>> countDeletedBranches() {
        return ResponseEntity.ok(ApiResponse.success(branchService.countDeletedBranches()));
    }

    @GetMapping("/counts/type/{branchType}")
    public ResponseEntity<ApiResponse<Long>> countByBranchType(@PathVariable String branchType) {
        return ResponseEntity.ok(ApiResponse.success(branchService.countByBranchType(branchType)));
    }
}
