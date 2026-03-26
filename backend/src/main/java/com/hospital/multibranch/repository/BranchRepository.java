package com.hospital.multibranch.repository;

import com.hospital.multibranch.model.Branch;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BranchRepository extends JpaRepository<Branch, Long> {

    // ========== ACTIVE ONLY QUERIES ==========
    @Query("SELECT b FROM Branch b WHERE b.isDeleted = false")
    List<Branch> findAllActive();

    @Query("SELECT b FROM Branch b WHERE b.isDeleted = false")
    Page<Branch> findAllActive(Pageable pageable);

    @Query("SELECT b FROM Branch b WHERE b.id = :id AND b.isDeleted = false")
    Optional<Branch> findActiveById(@Param("id") Long id);

    // ========== INCLUDING DELETED QUERIES ==========
    @Query("SELECT b FROM Branch b WHERE b.id = :id")
    Optional<Branch> findByIdIncludingDeleted(@Param("id") Long id);

    @Query("SELECT b FROM Branch b WHERE b.isDeleted = true")
    List<Branch> findAllDeleted();

    // ========== FILTER QUERIES ==========
    @Query("SELECT b FROM Branch b WHERE " +
            "(:search IS NULL OR LOWER(b.branchName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(b.branchCode) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
            "(:region IS NULL OR b.region = :region) AND " +
            "(:city IS NULL OR b.city = :city) AND " +
            "(:branchType IS NULL OR b.branchType = :branchType) AND " +
            "(:isActive IS NULL OR b.isActive = :isActive) AND " +
            "(:includeDeleted = true OR b.isDeleted = false)")
    Page<Branch> findByFilters(
            @Param("search") String search,
            @Param("region") String region,
            @Param("city") String city,
            @Param("branchType") Branch.BranchType branchType,
            @Param("isActive") Boolean isActive,
            @Param("includeDeleted") Boolean includeDeleted,
            Pageable pageable);

    // ========== EXISTENCE CHECKS ==========
    boolean existsByBranchCodeAndIsDeletedFalse(String branchCode);

    boolean existsByBranchNameAndIsDeletedFalse(String branchName);

    boolean existsByRegistrationNumberAndIsDeletedFalse(String registrationNumber);

    // ========== COUNT QUERIES ==========
    @Query("SELECT COUNT(b) FROM Branch b WHERE b.isDeleted = false")
    long countActive();

    @Query("SELECT COUNT(b) FROM Branch b WHERE b.isDeleted = true")
    long countDeleted();

    @Query("SELECT COUNT(b) FROM Branch b WHERE b.branchType = :type AND b.isDeleted = false")
    long countByBranchTypeActive(@Param("type") Branch.BranchType type);

    // ========== SOFT DELETE OPERATIONS ==========
    @Modifying
    @Query("UPDATE Branch b SET b.isDeleted = true, b.deletedAt = :now, b.deletedBy = :deletedBy WHERE b.id = :id")
    void softDeleteById(@Param("id") Long id, @Param("deletedBy") Long deletedBy, @Param("now") LocalDateTime now);

    @Modifying
    @Query("UPDATE Branch b SET b.isDeleted = false, b.deletedAt = null, b.deletedBy = null WHERE b.id = :id")
    void restoreById(@Param("id") Long id);

    // ========== REGION BASED QUERIES ==========
    @Query("SELECT DISTINCT b.region FROM Branch b WHERE b.region IS NOT NULL AND b.isDeleted = false")
    List<String> findAllRegions();

    @Query("SELECT DISTINCT b.city FROM Branch b WHERE b.city IS NOT NULL AND b.isDeleted = false")
    List<String> findAllCities();

    // Compatibility methods for existing code
    Optional<Branch> findByBranchCode(String branchCode);
}
