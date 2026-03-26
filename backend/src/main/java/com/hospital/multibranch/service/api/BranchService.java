package com.hospital.multibranch.service.api;

import com.hospital.multibranch.dto.request.CreateBranchRequest;
import com.hospital.multibranch.dto.request.UpdateBranchRequest;
import com.hospital.multibranch.dto.response.BranchResponse;
import com.hospital.multibranch.dto.response.BranchStatsResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface BranchService {

    // ========== BASIC CRUD OPERATIONS ==========
    List<BranchResponse> getAllBranches(Boolean includeDeleted);

    Page<BranchResponse> getBranchesPaginated(
            String search, String region, String city,
            String branchType, Boolean isActive, Boolean includeDeleted,
            Pageable pageable);

    BranchResponse getBranchById(Long id);

    BranchResponse getBranchByIdIncludingDeleted(Long id);

    BranchResponse createBranch(CreateBranchRequest request, Long createdBy);

    BranchResponse updateBranch(Long id, UpdateBranchRequest request, Long updatedBy);

    // ========== SOFT DELETE OPERATIONS ==========
    void softDeleteBranch(Long id, Long deletedBy);

    void restoreBranch(Long id, Long restoredBy);

    void permanentDeleteBranch(Long id, Long deletedBy);

    // ========== BULK OPERATIONS ==========
    void bulkSoftDelete(List<Long> ids, Long deletedBy);

    void bulkRestore(List<Long> ids, Long restoredBy);

    // ========== STATISTICS ==========
    BranchStatsResponse getBranchStats(Long id);

    List<BranchStatsResponse> getAllBranchesStats();

    // ========== FILTERS AND UTILITIES ==========
    List<String> getAllRegions();

    List<String> getAllCities();

    boolean checkBranchCode(String code);

    boolean checkBranchName(String name);

    // ========== COUNTS ==========
    long countActiveBranches();

    long countDeletedBranches();

    long countByBranchType(String branchType);
}
