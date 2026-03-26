package com.hospital.reception.repository;

import com.hospital.reception.model.ReceptionQueue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReceptionQueueRepository extends JpaRepository<ReceptionQueue, Long> {

    Optional<ReceptionQueue> findByPatientEntryId(Long patientEntryId);

    List<ReceptionQueue> findByBranchIdOrderByQueueNumberAsc(Long branchId);

    @Query("SELECT q FROM ReceptionQueue q WHERE q.branch.id = :branchId AND q.queueStatus = :status ORDER BY q.queueNumber ASC")
    List<ReceptionQueue> findByBranchIdAndQueueStatusOrderByQueueNumberAsc(@Param("branchId") Long branchId, @Param("status") ReceptionQueue.QueueStatus status);

    @Query("SELECT COUNT(q) FROM ReceptionQueue q WHERE q.branch.id = :branchId AND DATE(q.createdAt) = :date")
    Long countByBranchAndDate(@Param("branchId") Long branchId, @Param("date") LocalDate date);

    @Query("SELECT COUNT(q) FROM ReceptionQueue q WHERE q.branch.id = :branchId AND DATE(q.createdAt) = :date AND q.queueStatus = :status")
    Long countByBranchAndDateAndStatus(@Param("branchId") Long branchId, @Param("date") LocalDate date, @Param("status") ReceptionQueue.QueueStatus status);

    @Query("SELECT MAX(q.queueNumber) FROM ReceptionQueue q WHERE q.branch.id = :branchId AND DATE(q.createdAt) = :date")
    Integer findMaxQueueNumberByBranchAndDate(@Param("branchId") Long branchId, @Param("date") LocalDate date);

    @Query("SELECT q FROM ReceptionQueue q WHERE q.branch.id = :branchId AND q.queueStatus IN :statuses ORDER BY q.queueNumber ASC")
    List<ReceptionQueue> findByBranchIdAndQueueStatusInOrderByQueueNumberAsc(@Param("branchId") Long branchId, @Param("statuses") List<ReceptionQueue.QueueStatus> statuses);
}
