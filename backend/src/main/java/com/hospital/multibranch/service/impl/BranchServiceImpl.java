package com.hospital.multibranch.service.impl;

import com.hospital.multibranch.dto.request.CreateBranchRequest;
import com.hospital.multibranch.dto.request.UpdateBranchRequest;
import com.hospital.multibranch.dto.response.BranchResponse;
import com.hospital.multibranch.dto.response.BranchStatsResponse;
import com.hospital.common.exception.ResourceNotFoundException;
import com.hospital.multibranch.model.Branch;
import com.hospital.multibranch.repository.BranchRepository;
import com.hospital.multibranch.service.api.BranchService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class BranchServiceImpl implements BranchService {

    private final BranchRepository branchRepository;

    // ========== BASIC CRUD OPERATIONS ==========

    @Override
    @Transactional(readOnly = true)
    public List<BranchResponse> getAllBranches(Boolean includeDeleted) {
        log.info("Fetching all branches, includeDeleted: {}", includeDeleted);

        List<Branch> branches = Boolean.TRUE.equals(includeDeleted)
                ? branchRepository.findAll()
                : branchRepository.findAllActive();

        return branches.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BranchResponse> getBranchesPaginated(
            String search, String region, String city,
            String branchType, Boolean isActive, Boolean includeDeleted,
            Pageable pageable) {

        log.info("Fetching paginated branches with filters");

        Branch.BranchType type = (branchType != null && !branchType.isEmpty()) ? Branch.BranchType.valueOf(branchType)
                : null;

        Page<Branch> branchPage = branchRepository.findByFilters(
                search, region, city, type, isActive, includeDeleted, pageable);

        List<BranchResponse> responses = branchPage.getContent().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        return new PageImpl<>(responses, pageable, branchPage.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    public BranchResponse getBranchById(Long id) {
        log.info("Fetching active branch with id: {}", id);

        Branch branch = branchRepository.findActiveById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Branch", "id", id));

        return convertToResponse(branch);
    }

    @Override
    @Transactional(readOnly = true)
    public BranchResponse getBranchByIdIncludingDeleted(Long id) {
        log.info("Fetching branch with id including deleted: {}", id);

        Branch branch = branchRepository.findByIdIncludingDeleted(id)
                .orElseThrow(() -> new ResourceNotFoundException("Branch", "id", id));

        return convertToResponse(branch);
    }

    @Override
    @Transactional
    public BranchResponse createBranch(CreateBranchRequest request, Long createdBy) {
        log.info("Creating new branch: {}", request.getBranchName());

        // Check uniqueness
        if (branchRepository.existsByBranchCodeAndIsDeletedFalse(request.getBranchCode())) {
            throw new RuntimeException("Branch code already exists: " + request.getBranchCode());
        }

        if (branchRepository.existsByBranchNameAndIsDeletedFalse(request.getBranchName())) {
            throw new RuntimeException("Branch name already exists: " + request.getBranchName());
        }

        if (branchRepository.existsByRegistrationNumberAndIsDeletedFalse(request.getRegistrationNumber())) {
            throw new RuntimeException("Registration number already exists: " + request.getRegistrationNumber());
        }

        // Create new branch
        Branch branch = new Branch();
        branch.setBranchCode(request.getBranchCode());
        branch.setBranchName(request.getBranchName());
        branch.setBranchType(request.getBranchType());
        branch.setAddress(request.getAddress());
        branch.setCity(request.getCity());
        branch.setRegion(request.getRegion());
        branch.setPhone(request.getPhone());
        branch.setEmail(request.getEmail());
        branch.setRegistrationNumber(request.getRegistrationNumber());
        branch.setTaxId(request.getTaxId());
        branch.setEstablishedDate(request.getEstablishedDate());
        branch.setIsActive(true);
        branch.setIsDeleted(false);
        branch.setCreatedBy(createdBy);
        branch.setCreatedAt(LocalDateTime.now());

        Branch savedBranch = branchRepository.save(branch);

        return convertToResponse(savedBranch);
    }

    @Override
    @Transactional
    public BranchResponse updateBranch(Long id, UpdateBranchRequest request, Long updatedBy) {
        log.info("Updating branch with id: {}", id);

        Branch branch = branchRepository.findActiveById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Branch", "id", id));

        // Update fields if provided
        if (request.getBranchName() != null) {
            branch.setBranchName(request.getBranchName());
        }

        if (request.getAddress() != null) {
            branch.setAddress(request.getAddress());
        }

        if (request.getCity() != null) {
            branch.setCity(request.getCity());
        }

        if (request.getRegion() != null) {
            branch.setRegion(request.getRegion());
        }

        if (request.getPhone() != null) {
            branch.setPhone(request.getPhone());
        }

        if (request.getEmail() != null) {
            branch.setEmail(request.getEmail());
        }

        if (request.getTaxId() != null) {
            branch.setTaxId(request.getTaxId());
        }

        if (request.getIsActive() != null) {
            branch.setIsActive(request.getIsActive());
        }

        branch.setUpdatedBy(updatedBy);
        branch.setUpdatedAt(LocalDateTime.now());

        Branch updatedBranch = branchRepository.save(branch);

        return convertToResponse(updatedBranch);
    }

    // ========== SOFT DELETE OPERATIONS ==========

    @Override
    @Transactional
    public void softDeleteBranch(Long id, Long deletedBy) {
        log.info("Soft deleting branch with id: {}", id);

        Branch branch = branchRepository.findActiveById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Branch", "id", id));

        branchRepository.softDeleteById(id, deletedBy, LocalDateTime.now());
    }

    @Override
    @Transactional
    public void restoreBranch(Long id, Long restoredBy) {
        log.info("Restoring branch with id: {}", id);

        Branch branch = branchRepository.findByIdIncludingDeleted(id)
                .orElseThrow(() -> new ResourceNotFoundException("Branch", "id", id));

        if (!branch.getIsDeleted()) {
            throw new RuntimeException("Branch is not deleted");
        }

        // Check for conflicts
        if (branchRepository.existsByBranchCodeAndIsDeletedFalse(branch.getBranchCode())) {
            throw new RuntimeException("Cannot restore: Branch code already exists in another active branch");
        }

        if (branchRepository.existsByBranchNameAndIsDeletedFalse(branch.getBranchName())) {
            throw new RuntimeException("Cannot restore: Branch name already exists in another active branch");
        }

        branchRepository.restoreById(id);
    }

    @Override
    @Transactional
    public void permanentDeleteBranch(Long id, Long deletedBy) {
        log.info("Permanently deleting branch with id: {}", id);

        Branch branch = branchRepository.findByIdIncludingDeleted(id)
                .orElseThrow(() -> new ResourceNotFoundException("Branch", "id", id));

        branchRepository.delete(branch);
    }

    // ========== BULK OPERATIONS ==========

    @Override
    @Transactional
    public void bulkSoftDelete(List<Long> ids, Long deletedBy) {
        log.info("Bulk soft deleting branches: {}", ids);

        for (Long id : ids) {
            try {
                softDeleteBranch(id, deletedBy);
            } catch (Exception e) {
                log.error("Failed to soft delete branch {}: {}", id, e.getMessage());
            }
        }
    }

    @Override
    @Transactional
    public void bulkRestore(List<Long> ids, Long restoredBy) {
        log.info("Bulk restoring branches: {}", ids);

        for (Long id : ids) {
            try {
                restoreBranch(id, restoredBy);
            } catch (Exception e) {
                log.error("Failed to restore branch {}: {}", id, e.getMessage());
            }
        }
    }

    // ========== STATISTICS ==========

    @Override
    @Transactional(readOnly = true)
    public BranchStatsResponse getBranchStats(Long id) {
        log.info("Fetching statistics for branch id: {}", id);

        Branch branch = branchRepository.findActiveById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Branch", "id", id));

        // These would come from other repositories in real implementation
        return BranchStatsResponse.builder()
                .branchId(branch.getId())
                .branchName(branch.getBranchName())
                .branchCode(branch.getBranchCode())
                .totalStaff(45)
                .doctors(12)
                .nurses(18)
                .labTechnicians(5)
                .pharmacists(3)
                .receptionists(4)
                .cashiers(2)
                .administrators(1)
                .totalPatients(1250)
                .activePatients(320)
                .totalAdmissions(85)
                .availableBeds(15)
                .occupiedBeds(35)
                .bedOccupancyRate(70.0)
                .monthlyRevenue(125000.0)
                .yearlyRevenue(1500000.0)
                .patientSatisfaction(4.5)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<BranchStatsResponse> getAllBranchesStats() {
        log.info("Fetching statistics for all branches");

        List<Branch> branches = branchRepository.findAllActive();
        List<BranchStatsResponse> stats = new ArrayList<>();

        for (Branch branch : branches) {
            stats.add(getBranchStats(branch.getId()));
        }

        return stats;
    }

    // ========== FILTERS AND UTILITIES ==========

    @Override
    @Transactional(readOnly = true)
    public List<String> getAllRegions() {
        return branchRepository.findAllRegions();
    }

    @Override
    @Transactional(readOnly = true)
    public List<String> getAllCities() {
        return branchRepository.findAllCities();
    }

    @Override
    @Transactional(readOnly = true)
    public boolean checkBranchCode(String code) {
        return branchRepository.existsByBranchCodeAndIsDeletedFalse(code);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean checkBranchName(String name) {
        return branchRepository.existsByBranchNameAndIsDeletedFalse(name);
    }

    // ========== COUNTS ==========

    @Override
    @Transactional(readOnly = true)
    public long countActiveBranches() {
        return branchRepository.countActive();
    }

    @Override
    @Transactional(readOnly = true)
    public long countDeletedBranches() {
        return branchRepository.countDeleted();
    }

    @Override
    @Transactional(readOnly = true)
    public long countByBranchType(String branchType) {
        return branchRepository.countByBranchTypeActive(Branch.BranchType.valueOf(branchType));
    }

    // ========== PRIVATE HELPER METHODS ==========

    private BranchResponse convertToResponse(Branch branch) {
        return BranchResponse.builder()
                .id(branch.getId())
                .branchCode(branch.getBranchCode())
                .branchName(branch.getBranchName())
                .branchType(branch.getBranchType().toString())
                .address(branch.getAddress())
                .city(branch.getCity())
                .region(branch.getRegion())
                .phone(branch.getPhone())
                .email(branch.getEmail())
                .registrationNumber(branch.getRegistrationNumber())
                .taxId(branch.getTaxId())
                .establishedDate(branch.getEstablishedDate())
                .isActive(branch.getIsActive())
                .isDeleted(branch.getIsDeleted())
                .deletedAt(branch.getDeletedAt())
                .userCount(45) // This would come from user repository
                .createdAt(branch.getCreatedAt())
                .updatedAt(branch.getUpdatedAt())
                .build();
    }
}
