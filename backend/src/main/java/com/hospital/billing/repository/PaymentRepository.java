package com.hospital.billing.repository;

import com.hospital.billing.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    @Query("SELECT p FROM Payment p WHERE p.branch.id = :branchId ORDER BY p.paymentDate DESC")
    List<Payment> findByBranchIdOrderByPaymentDateDesc(@Param("branchId") Long branchId);
    
    @Query("SELECT p FROM Payment p WHERE p.branch.id = :branchId AND DATE(p.paymentDate) = :date ORDER BY p.paymentDate DESC")
    List<Payment> findByBranchIdAndDateOrderByPaymentDateDesc(@Param("branchId") Long branchId, @Param("date") LocalDate date);

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.branch.id = :branchId AND DATE(p.paymentDate) = :date")
    Double sumAmountByBranchAndDate(@Param("branchId") Long branchId, @Param("date") LocalDate date);

    @Query("SELECT COUNT(p) FROM Payment p WHERE p.branch.id = :branchId AND DATE(p.paymentDate) = :date")
    Integer countByBranchAndDate(@Param("branchId") Long branchId, @Param("date") LocalDate date);

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.branch.id = :branchId AND DATE(p.paymentDate) = :date AND p.paymentMethod = :method")
    Double sumAmountByBranchAndDateAndMethod(@Param("branchId") Long branchId, @Param("date") LocalDate date, @Param("method") String method);
}
