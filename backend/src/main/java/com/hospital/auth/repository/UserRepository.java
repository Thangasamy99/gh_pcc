package com.hospital.auth.repository;

import com.hospital.auth.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // ── Find active users by credentials ─────────────────────────────
    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    Optional<User> findByUsernameOrEmail(String username, String email);

    // ── Existence checks ──────────────────────────────────────────────
    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    boolean existsByStaffId(String staffId);

    // ── Role-based queries ────────────────────────────────────────────
    @Query("SELECT u FROM User u WHERE u.role.roleCode = :roleCode AND u.isActive = true")
    List<User> findActiveByRoleCode(@Param("roleCode") String roleCode);

    @Query("SELECT u FROM User u WHERE u.primaryBranch.id = :branchId AND u.isActive = true")
    List<User> findActiveByBranchId(@Param("branchId") Long branchId);

    @Query("SELECT COUNT(u) FROM User u WHERE u.primaryBranch.id = :branchId AND u.isActive = true")
    long countActiveByBranchId(@Param("branchId") Long branchId);

    @Query("SELECT COUNT(u) FROM User u WHERE u.primaryBranch.id = :branchId")
    long countByBranchId(@Param("branchId") Long branchId);

    // ── Account status queries ────────────────────────────────────────
    @Query("SELECT COUNT(u) FROM User u WHERE u.isActive = true")
    long countActiveUsers();

    @Query("SELECT COUNT(u) FROM User u WHERE u.isActive = false")
    long countInactiveUsers();

    // ── Update last login ─────────────────────────────────────────────
    @Modifying
    @Query("UPDATE User u SET u.lastLoginAt = :loginTime, u.lastLoginIp = :ipAddress, u.failedAttempts = 0 WHERE u.id = :id")
    void updateLastLogin(@Param("id") Long id,
            @Param("loginTime") LocalDateTime loginTime,
            @Param("ipAddress") String ipAddress);

    // ── Failed attempts ───────────────────────────────────────────────
    @Modifying
    @Query("UPDATE User u SET u.failedAttempts = u.failedAttempts + 1 WHERE u.id = :id")
    void incrementFailedAttempts(@Param("id") Long id);

    @Modifying
    @Query("UPDATE User u SET u.failedAttempts = 0, u.isLocked = false WHERE u.id = :id")
    void resetFailedAttempts(@Param("id") Long id);

    @Modifying
    @Query("UPDATE User u SET u.isLocked = true WHERE u.id = :id")
    void lockUser(@Param("id") Long id);

    List<User> findByStaffIdIsNull();

    @Query("SELECT u FROM User u WHERE u.role.roleCode IN ('DOCTOR', 'SURGEON', 'SPECIALIST') AND u.primaryBranch.id = :branchId AND u.isActive = true")
    List<User> findDoctorsByBranchId(@Param("branchId") Long branchId);

    @Query("SELECT u FROM User u WHERE u.role.roleCode IN ('DOCTOR', 'SURGEON', 'SPECIALIST') AND u.primaryBranch.id = :branchId AND u.availabilityStatus = 'AVAILABLE' AND u.isActive = true")
    List<User> findAvailableDoctorsByBranchId(@Param("branchId") Long branchId);

    @Query("SELECT u FROM User u WHERE u.role.roleCode IN ('DOCTOR', 'SURGEON', 'SPECIALIST') AND u.consultationRoom = :roomId AND u.availabilityStatus = 'AVAILABLE' AND u.isActive = true")
    List<User> findAvailableDoctorsByRoom(@Param("roomId") String roomId);
}
