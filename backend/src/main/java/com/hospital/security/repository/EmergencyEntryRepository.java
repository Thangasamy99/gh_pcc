package com.hospital.security.repository;

import com.hospital.security.model.EmergencyEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmergencyEntryRepository extends JpaRepository<EmergencyEntry, Long> {
    List<EmergencyEntry> findByBranchIdOrderByCreatedAtDesc(Long branchId);
}
