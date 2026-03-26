package com.hospital.reception.repository;

import com.hospital.reception.model.PatientVitals;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PatientVitalsRepository extends JpaRepository<PatientVitals, Long> {

    Optional<PatientVitals> findByPatientEntryId(Long patientEntryId);

    List<PatientVitals> findByBranchIdAndCreatedAtBetween(Long branchId, LocalDateTime startDate, LocalDateTime endDate);

    @Query("SELECT COUNT(v) FROM PatientVitals v WHERE v.branch.id = :branchId AND DATE(v.createdAt) = :date")
    Long countByBranchAndDate(@Param("branchId") Long branchId, @Param("date") LocalDate date);

    @Query("SELECT COUNT(v) FROM PatientVitals v WHERE v.branch.id = :branchId AND DATE(v.createdAt) = :date AND v.triageStatus = :status")
    Long countByBranchAndDateAndTriageStatus(@Param("branchId") Long branchId, @Param("date") LocalDate date, @Param("status") com.hospital.reception.model.PatientVitals.TriageStatus status);
}
