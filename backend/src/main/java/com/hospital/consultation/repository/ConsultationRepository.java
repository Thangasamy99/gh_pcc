package com.hospital.consultation.repository;

import com.hospital.consultation.model.Consultation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface ConsultationRepository extends JpaRepository<Consultation, Long> {
    Optional<Consultation> findByConsultationId(String consultationId);

    @Query("SELECT COUNT(c) FROM Consultation c WHERE c.branch.id = :branchId AND c.consultationDate >= :start AND c.consultationDate <= :end")
    Long countByBranchIdAndConsultationDateBetween(@Param("branchId") Long branchId, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}
