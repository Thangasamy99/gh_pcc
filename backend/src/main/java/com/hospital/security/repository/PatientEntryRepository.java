package com.hospital.security.repository;

import com.hospital.security.model.PatientEntry;
import com.hospital.security.model.EntryStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PatientEntryRepository extends JpaRepository<PatientEntry, Long> {
    
    List<PatientEntry> findByBranchIdAndCreatedAtBetweenOrderByCreatedAtDesc(
            Long branchId, LocalDateTime start, LocalDateTime end);
    
    @Query("SELECT COUNT(p) FROM PatientEntry p WHERE p.branch.id = :branchId AND p.createdAt BETWEEN :start AND :end")
    long countByBranchIdAndEntryTimeBetween(
            @Param("branchId") Long branchId, 
            @Param("start") LocalDateTime start, 
            @Param("end") LocalDateTime end);
    
    @Query("SELECT COUNT(p) FROM PatientEntry p WHERE p.branch.id = :branchId AND p.status = :status")
    long countByBranchIdAndStatus(@Param("branchId") Long branchId, @Param("status") EntryStatus status);

    Page<PatientEntry> findByBranchIdOrderByCreatedAtDesc(Long branchId, Pageable pageable);
    
    // Additional methods for Reception
    List<PatientEntry> findByBranchIdAndEntryDateOrderByEntryTimeAsc(Long branchId, LocalDate entryDate);
    
    List<PatientEntry> findByBranchIdAndStatusOrderByEntryTimeAsc(Long branchId, EntryStatus status);
    
    Optional<PatientEntry> findByIdAndBranchId(Long id, Long branchId);
    
    @Query("SELECT p FROM PatientEntry p WHERE p.branch.id = :branchId AND p.entryDate = :date ORDER BY p.entryTime ASC")
    List<PatientEntry> findTodayEntries(@Param("branchId") Long branchId, @Param("date") LocalDate date);
    
    @Query("SELECT p FROM PatientEntry p WHERE p.branch.id = :branchId AND p.status = :status AND p.entryDate = :date ORDER BY p.entryTime ASC")
    List<PatientEntry> findPendingEntries(@Param("branchId") Long branchId, @Param("status") EntryStatus status, @Param("date") LocalDate date);
}
