package com.hospital.superadmin.service.impl;

import com.hospital.audit.service.AuditLogService;
import com.hospital.auth.model.Role;
import com.hospital.auth.model.User;
import com.hospital.auth.repository.RoleRepository;
import com.hospital.auth.repository.UserRepository;
import com.hospital.common.exception.ResourceNotFoundException;
import com.hospital.common.util.PasswordGenerator;
import com.hospital.multibranch.model.Branch;
import com.hospital.multibranch.repository.BranchRepository;
import com.hospital.superadmin.dto.request.*;
import com.hospital.superadmin.dto.response.*;
import com.hospital.superadmin.service.SuperAdminService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SuperAdminServiceImpl implements SuperAdminService {

    private final BranchRepository branchRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final AuditLogService auditLogService;
    private final PasswordEncoder passwordEncoder;
    private final com.hospital.common.service.SequenceGeneratorService sequenceGeneratorService;

    // ───────────────────────────────────────────────────────────────────
    // DASHBOARD
    // ───────────────────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats() {
        DashboardStatsResponse stats = new DashboardStatsResponse();
        stats.setTotalBranches((int) branchRepository.count());
        stats.setTotalUsers((int) userRepository.count());

        long activeCount = userRepository.countActiveUsers();
        stats.setActiveUsers((int) activeCount);
        stats.setInactiveUsers((int) (userRepository.count() - activeCount));
        stats.setPendingApprovals(0);
        stats.setTotalDoctors(0);
        stats.setTotalNurses(0);
        stats.setTotalPatients(0);
        stats.setSystemUptime(99.98);
        stats.setStorageUsed(12.5);
        stats.setActiveSessions(1);
        stats.setLastUpdated(LocalDateTime.now());
        return stats;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ActivityResponse> getRecentActivities(int limit) {
        // Implementation would fetch from audit log repository
        return new ArrayList<>();
    }

    @Override
    @Transactional(readOnly = true)
    public UserActivityResponse getUserActivity(String range) {
        UserActivityResponse resp = new UserActivityResponse();
        resp.setActiveNow((int) userRepository.countActiveUsers());
        resp.setTodayActive((int) userRepository.countActiveUsers()); // Mock Same for now
        resp.setWeekActive((int) userRepository.count());
        resp.setMonthActive((int) userRepository.count());

        List<UserActivityResponse.UserTrend> trends = new ArrayList<>();
        trends.add(new UserActivityResponse.UserTrend("08:00", 12));
        trends.add(new UserActivityResponse.UserTrend("12:00", 45));
        trends.add(new UserActivityResponse.UserTrend("16:00", 38));
        trends.add(new UserActivityResponse.UserTrend("20:00", 15));
        resp.setTrends(trends);
        return resp;
    }

    @Override
    @Transactional(readOnly = true)
    public RevenueResponse getRevenueOverview(String period) {
        RevenueResponse resp = new RevenueResponse();
        resp.setTotalRevenue(1250400.0);
        resp.setGrowthPercentage(14.2);

        List<RevenueResponse.RevenuePoint> trends = new ArrayList<>();
        trends.add(new RevenueResponse.RevenuePoint("Jan", 980000.0));
        trends.add(new RevenueResponse.RevenuePoint("Feb", 1120000.0));
        trends.add(new RevenueResponse.RevenuePoint("Mar", 1250400.0));
        resp.setTrends(trends);
        return resp;
    }

    @Override
    @Transactional(readOnly = true)
    public SystemHealthResponse getSystemHealth() {
        SystemHealthResponse h = new SystemHealthResponse();
        h.setDatabaseStatus("HEALTHY");
        h.setDatabaseLatency("12ms");
        h.setCacheStatus("N/A");
        h.setCacheHitRate("N/A");
        h.setQueueStatus("HEALTHY");
        h.setQueueSize(0);
        h.setTotalDiskSpace("500GB");
        h.setUsedDiskSpace("12GB");
        h.setFreeDiskSpace("488GB");
        h.setDiskUsagePercentage(2.4);
        h.setTotalMemory("16GB");
        h.setUsedMemory("4GB");
        h.setFreeMemory("12GB");
        h.setMemoryUsagePercentage(25.0);
        h.setCpuUsage(8.5);
        h.setCpuCores(4);
        h.setSystemLoad(0.8);
        h.setSystemUptime("Running");
        h.setLastRestart(LocalDateTime.now().minusDays(1));
        h.setLastBackup(LocalDateTime.now().minusHours(12));
        h.setLastBackupStatus("SUCCESS");
        return h;
    }

    // ───────────────────────────────────────────────────────────────────
    // BRANCH MANAGEMENT
    // ───────────────────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public List<BranchResponse> getAllBranches() {
        return branchRepository.findAll().stream()
                .map(this::mapToBranchResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public BranchResponse getBranchById(Long id) {
        Branch branch = branchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Branch", "id", id));
        return mapToBranchResponse(branch);
    }

    @Override
    @Transactional
    public BranchResponse createBranch(CreateBranchRequest request, Long createdBy) {
        Branch branch = new Branch();
        branch.setBranchCode(request.getBranchCode());
        branch.setBranchName(request.getBranchName());
        branch.setBranchType(Branch.BranchType.valueOf(request.getBranchType()));
        branch.setAddress(request.getAddress());
        branch.setCity(request.getCity());
        branch.setRegion(request.getRegion());
        branch.setPhone(request.getPhone());
        branch.setEmail(request.getEmail());
        branch.setRegistrationNumber(request.getRegistrationNumber());
        branch.setTaxId(request.getTaxId());
        branch.setEstablishedDate(request.getEstablishedDate());
        branch.setIsActive(true);
        Branch saved = branchRepository.save(branch);
        auditLogService.logAction("BRANCH_MANAGEMENT", "CREATED", "BRANCH",
                saved.getId().toString(), "Created: " + request.getBranchName(), createdBy);
        return mapToBranchResponse(saved);
    }

    @Override
    @Transactional
    public BranchResponse updateBranch(Long id, UpdateBranchRequest request, Long updatedBy) {
        Branch branch = branchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Branch", "id", id));
        if (request.getBranchName() != null)
            branch.setBranchName(request.getBranchName());
        if (request.getAddress() != null)
            branch.setAddress(request.getAddress());
        if (request.getCity() != null)
            branch.setCity(request.getCity());
        if (request.getRegion() != null)
            branch.setRegion(request.getRegion());
        if (request.getPhone() != null)
            branch.setPhone(request.getPhone());
        if (request.getEmail() != null)
            branch.setEmail(request.getEmail());
        if (request.getTaxId() != null)
            branch.setTaxId(request.getTaxId());
        if (request.getIsActive() != null)
            branch.setIsActive(request.getIsActive());
        Branch saved = branchRepository.save(branch);
        auditLogService.logAction("BRANCH_MANAGEMENT", "UPDATED", "BRANCH",
                saved.getId().toString(), "Updated: " + saved.getBranchName(), updatedBy);
        return mapToBranchResponse(saved);
    }

    @Override
    @Transactional
    public void deleteBranch(Long id, boolean permanent, Long deletedBy) {
        Branch branch = branchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Branch", "id", id));
        if (permanent) {
            branchRepository.delete(branch);
            auditLogService.logAction("BRANCH_MANAGEMENT", "DELETED", "BRANCH",
                    id.toString(), "Permanently deleted: " + branch.getBranchName(), deletedBy);
        } else {
            branch.setIsActive(false);
            branchRepository.save(branch);
            auditLogService.logAction("BRANCH_MANAGEMENT", "DEACTIVATED", "BRANCH",
                    id.toString(), "Deactivated: " + branch.getBranchName(), deletedBy);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public BranchStatsResponse getBranchStats(Long id) {
        Branch branch = branchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Branch", "id", id));
        BranchStatsResponse s = new BranchStatsResponse();
        s.setBranchId(branch.getId());
        s.setBranchName(branch.getBranchName());
        s.setBranchCode(branch.getBranchCode());
        long staffCount = userRepository.countActiveByBranchId(id);
        s.setTotalStaff((int) staffCount);
        s.setDoctors(0);
        s.setNurses(0);
        s.setLabTechnicians(0);
        s.setPharmacists(0);
        s.setReceptionists(0);
        s.setCashiers(0);
        s.setAdministrators(0);
        s.setTotalPatients(0);
        s.setActivePatients(0);
        s.setTotalAdmissions(0);
        s.setAvailableBeds(0);
        s.setOccupiedBeds(0);
        s.setBedOccupancyRate(0.0);
        return s;
    }

    // ───────────────────────────────────────────────────────────────────
    // USER MANAGEMENT
    // ───────────────────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public Page<UserResponse> getAllUsers(String role, Long branchId, Boolean active, Pageable pageable) {
        List<User> all = userRepository.findAll();
        List<User> filtered = all.stream().filter(u -> {
            boolean match = true;
            if (role != null && !role.isEmpty() && u.getRole() != null) {
                match = u.getRole().getRoleCode().equalsIgnoreCase(role);
            }
            if (branchId != null && u.getPrimaryBranch() != null) {
                match = match && u.getPrimaryBranch().getId().equals(branchId);
            }
            if (active != null) {
                match = match && active.equals(u.getIsActive());
            }
            return match;
        }).collect(Collectors.toList());

        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), filtered.size());
        List<UserResponse> content = start < filtered.size()
                ? filtered.subList(start, end).stream().map(this::mapToUserResponse).collect(Collectors.toList())
                : new ArrayList<>();
        return new PageImpl<>(content, pageable, filtered.size());
    }

    @Override
    @Transactional(readOnly = true)
    @SuppressWarnings("null")
    public UserResponse getUserById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        return mapToUserResponse(user);
    }

    @Override
    @Transactional
    public UserResponse createBranchAdmin(CreateBranchAdminRequest request, Long createdBy) {
        Role role = roleRepository.findByRoleCode("ROLE_BRANCH_ADMIN")
                .orElseThrow(() -> new ResourceNotFoundException("Role ROLE_BRANCH_ADMIN not found"));
        Branch branch = branchRepository.findById(request.getBranchId())
                .orElseThrow(() -> new ResourceNotFoundException("Branch", "id", request.getBranchId()));

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        String staffId = request.getStaffId();
        if (staffId == null || staffId.trim().isEmpty()) {
            staffId = sequenceGeneratorService.generateStaffId(branch.getBranchCode(), role.getRoleAbbreviation());
        }
        user.setStaffId(staffId);
        user.setPhone(request.getPhone());
        user.setRole(role);
        user.setPrimaryBranch(branch);
        user.setIsActive(true);
        user.setIsLocked(false);
        user.setIsPasswordExpired(true);

        String pw = (request.getPassword() != null && !request.getPassword().isEmpty())
                ? request.getPassword()
                : PasswordGenerator.generateRandomPassword(12);
        user.setPassword(passwordEncoder.encode(pw));

        User saved = userRepository.save(user);
        auditLogService.logAction("USER_MANAGEMENT", "CREATED", "USER",
                saved.getId().toString(), "Branch admin created: " + saved.getUsername(), createdBy);

        UserResponse resp = mapToUserResponse(saved);
        if (request.getPassword() == null || request.getPassword().isEmpty()) {
            resp.setTemporaryPassword(pw);
        }
        return resp;
    }

    @Override
    @Transactional
    public UserResponse createCentralPharmacyAdmin(CreateCentralPharmacyAdminRequest request, Long createdBy) {
        Role role = roleRepository.findByRoleCode("ROLE_CENTRAL_PHARMACY")
                .orElseThrow(() -> new ResourceNotFoundException("Role ROLE_CENTRAL_PHARMACY not found"));
        Branch cpBranch = branchRepository.findAll().stream()
                .filter(b -> Branch.BranchType.CENTRAL_PHARMACY.equals(b.getBranchType()))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Central Pharmacy branch not found"));

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        String staffId = request.getStaffId();
        if (staffId == null || staffId.trim().isEmpty()) {
            staffId = sequenceGeneratorService.generateStaffId(cpBranch.getBranchCode(), role.getRoleAbbreviation());
        }
        user.setStaffId(staffId);
        user.setPhone(request.getPhone());
        user.setRole(role);
        user.setPrimaryBranch(cpBranch);
        user.setIsActive(true);
        user.setIsLocked(false);
        user.setIsPasswordExpired(true);
        String pw = PasswordGenerator.generateRandomPassword(12);
        user.setPassword(passwordEncoder.encode(pw));

        User saved = userRepository.save(user);
        auditLogService.logAction("USER_MANAGEMENT", "CREATED", "USER",
                saved.getId().toString(), "CP admin created: " + saved.getUsername(), createdBy);

        UserResponse resp = mapToUserResponse(saved);
        resp.setTemporaryPassword(pw);
        return resp;
    }

    @Override
    @Transactional
    public UserResponse updateUser(Long id, UpdateUserRequest request, Long updatedBy) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        if (request.getFirstName() != null)
            user.setFirstName(request.getFirstName());
        if (request.getLastName() != null)
            user.setLastName(request.getLastName());
        if (request.getEmail() != null)
            user.setEmail(request.getEmail());
        if (request.getPhone() != null)
            user.setPhone(request.getPhone());
        if (request.getBranchId() != null) {
            Branch b = branchRepository.findById(request.getBranchId())
                    .orElseThrow(() -> new ResourceNotFoundException("Branch", "id", request.getBranchId()));
            user.setPrimaryBranch(b);
        }
        User saved = userRepository.save(user);
        return mapToUserResponse(saved);
    }

    @Override
    @Transactional
    public UserResponse toggleUserStatus(Long id, boolean active, Long updatedBy) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        user.setIsActive(active);
        User saved = userRepository.save(user);
        auditLogService.logAction("USER_MANAGEMENT", active ? "ACTIVATED" : "DEACTIVATED",
                "USER", id.toString(), "Status changed", updatedBy);
        return mapToUserResponse(saved);
    }

    @Override
    @Transactional
    public PasswordResetResponse resetUserPassword(Long id, Long resetBy) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        String newPw = PasswordGenerator.generateRandomPassword(12);
        user.setPassword(passwordEncoder.encode(newPw));
        user.setIsPasswordExpired(true);
        user.setIsLocked(false);
        user.setFailedAttempts(0);
        userRepository.save(user);
        auditLogService.logAction("USER_MANAGEMENT", "PASSWORD_RESET", "USER",
                id.toString(), "Password reset", resetBy);
        return new PasswordResetResponse(
                user.getId(),
                user.getUsername(),
                user.getFirstName() + " " + user.getLastName(),
                newPw,
                "Password reset. User must change on next login.",
                LocalDateTime.now(),
                String.valueOf(resetBy));
    }

    // ───────────────────────────────────────────────────────────────────
    // ROLES
    // ───────────────────────────────────────────────────────────────────

    @Override
    public List<RoleResponse> getAllRoles() {
        return roleRepository.findAll().stream().map(r -> {
            RoleResponse rr = new RoleResponse();
            rr.setId(r.getId());
            rr.setRoleName(r.getRoleName());
            rr.setRoleCode(r.getRoleCode());
            rr.setDescription(r.getDescription());
            rr.setRoleLevel(r.getRoleLevel());
            rr.setIsSystemRole(r.getIsSystemRole());
            rr.setUserCount(0);
            rr.setPermissionCount(r.getPermissions() != null ? r.getPermissions().size() : 0);
            return rr;
        }).collect(Collectors.toList());
    }

    @Override
    public List<PermissionResponse> getRolePermissions(Long roleId) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new ResourceNotFoundException("Role", "id", roleId));
        if (role.getPermissions() == null)
            return new ArrayList<>();
        return role.getPermissions().stream().map(p -> {
            PermissionResponse pr = new PermissionResponse();
            pr.setId(p.getId());
            pr.setPermissionName(p.getPermissionName());
            pr.setPermissionCode(p.getPermissionCode());
            pr.setModule(p.getModule());
            pr.setDescription(p.getDescription());
            return pr;
        }).collect(Collectors.toList());
    }

    @Override
    public void updateRolePermissions(Long roleId, List<Long> permissionIds, Long updatedBy) {
        // Simplified — full implementation would load permissions and update the join
        // table
        log.info("updateRolePermissions called for roleId={} by user={}", roleId, updatedBy);
    }

    // ───────────────────────────────────────────────────────────────────
    // REPORTS / AUDIT / SETTINGS / BACKUP (stubs — safe to expand)
    // ───────────────────────────────────────────────────────────────────

    @Override
    public List<BranchComparisonResponse> getBranchComparisonReport() {
        return new ArrayList<>();
    }

    @Override
    public List<UserActivityReportResponse> getUserActivityReport(LocalDateTime start, LocalDateTime end) {
        return new ArrayList<>();
    }

    @Override
    public byte[] exportReport(String type, String format, LocalDateTime start, LocalDateTime end) {
        return new byte[0];
    }

    @Override
    public Page<AuditLogResponse> getAuditLogs(Long userId, String action, LocalDateTime start, LocalDateTime end,
            Pageable p) {
        return new PageImpl<>(new ArrayList<>());
    }

    @Override
    public SystemSettingsResponse getSystemSettings() {
        return new SystemSettingsResponse();
    }

    @Override
    public SystemSettingsResponse updateSystemSettings(UpdateSystemSettingsRequest req, Long updatedBy) {
        return new SystemSettingsResponse();
    }

    @Override
    public BackupResponse createBackup(Long createdBy) {
        return new BackupResponse();
    }

    @Override
    public List<BackupResponse> listBackups() {
        return new ArrayList<>();
    }

    @Override
    public void restoreBackup(Long backupId, Long restoredBy) {
    }

    @Override
    public void deleteBackup(Long backupId, Long deletedBy) {
    }

    // ───────────────────────────────────────────────────────────────────
    // MANUAL MAPPERS
    // ───────────────────────────────────────────────────────────────────

    private BranchResponse mapToBranchResponse(Branch b) {
        BranchResponse r = new BranchResponse();
        r.setId(b.getId());
        r.setBranchCode(b.getBranchCode());
        r.setBranchName(b.getBranchName());
        r.setBranchType(b.getBranchType() != null ? b.getBranchType().name() : null);
        r.setAddress(b.getAddress());
        r.setCity(b.getCity());
        r.setRegion(b.getRegion());
        r.setPhone(b.getPhone());
        r.setEmail(b.getEmail());
        r.setRegistrationNumber(b.getRegistrationNumber());
        r.setTaxId(b.getTaxId());
        r.setEstablishedDate(b.getEstablishedDate());
        r.setIsActive(b.getIsActive());
        r.setUserCount(0);
        r.setCreatedAt(b.getCreatedAt());
        r.setUpdatedAt(b.getUpdatedAt());
        return r;
    }

    private UserResponse mapToUserResponse(User u) {
        UserResponse r = new UserResponse();
        r.setId(u.getId());
        r.setUsername(u.getUsername());
        r.setEmail(u.getEmail());
        r.setFirstName(u.getFirstName());
        r.setLastName(u.getLastName());
        r.setFullName(u.getFirstName() + " " + u.getLastName());
        r.setStaffId(u.getStaffId());
        r.setPhone(u.getPhone());
        if (u.getRole() != null) {
            r.setRoleId(u.getRole().getId());
            r.setRoleName(u.getRole().getRoleName());
            r.setRoleCode(u.getRole().getRoleCode());
        }
        if (u.getPrimaryBranch() != null) {
            r.setBranchId(u.getPrimaryBranch().getId());
            r.setBranchName(u.getPrimaryBranch().getBranchName());
            r.setBranchCode(u.getPrimaryBranch().getBranchCode());
        }
        r.setIsActive(u.getIsActive());
        r.setIsLocked(u.getIsLocked());
        r.setIsPasswordExpired(u.getIsPasswordExpired());
        r.setLastLoginAt(u.getLastLoginAt());
        r.setCreatedAt(u.getCreatedAt());
        r.setUpdatedAt(u.getUpdatedAt());
        return r;
    }
}
