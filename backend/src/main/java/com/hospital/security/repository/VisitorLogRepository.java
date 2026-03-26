package com.hospital.security.repository;

import com.hospital.security.model.VisitorLog;
import com.hospital.security.model.VisitorStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface VisitorLogRepository extends JpaRepository<VisitorLog, Long> {
    
    List<VisitorLog> findByBranchIdAndStatusOrderByEntryTimeDesc(Long branchId, VisitorStatus status);
    
    @Query("SELECT COUNT(v) FROM VisitorLog v WHERE v.branch.id = :branchId AND v.createdAt BETWEEN :start AND :end")
    long countByBranchIdAndEntryTimeBetween(
            @Param("branchId") Long branchId, 
            @Param("start") LocalDateTime start, 
            @Param("end") LocalDateTime end);
    
    @Query("SELECT COUNT(v) FROM VisitorLog v WHERE v.branch.id = :branchId AND v.status = :status")
    long countByBranchIdAndStatus(@Param("branchId") Long branchId, @Param("status") VisitorStatus status);

    List<VisitorLog> findByBranchIdOrderByCreatedAtDesc(Long branchId);

    @Query("SELECT v FROM VisitorLog v WHERE (LOWER(v.visitorName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(v.phoneNumber) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(v.nationalId) LIKE LOWER(CONCAT('%', :search, '%'))) AND v.branch.id = :branchId")
    Page<VisitorLog> searchVisitors(@Param("search") String search, @Param("branchId") Long branchId, Pageable pageable);
}
