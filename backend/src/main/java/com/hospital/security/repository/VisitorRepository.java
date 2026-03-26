package com.hospital.security.repository;

import com.hospital.security.model.Visitor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VisitorRepository extends JpaRepository<Visitor, Long> {
    
    List<Visitor> findByBranchIdAndStatus(Long branchId, String status);
    
    Optional<Visitor> findByVisitorId(String visitorId);
    
    @Query("SELECT v FROM Visitor v WHERE v.branch.id = :branchId AND v.status = :status ORDER BY v.entryTime DESC")
    List<Visitor> findActiveVisitorsByBranch(@Param("branchId") Long branchId, @Param("status") String status);
    
    @Query("SELECT v FROM Visitor v WHERE v.patientName LIKE %:patientName% OR v.visitorName LIKE %:visitorName% ORDER BY v.entryTime DESC")
    List<Visitor> searchVisitors(@Param("patientName") String patientName, @Param("visitorName") String visitorName);
}
