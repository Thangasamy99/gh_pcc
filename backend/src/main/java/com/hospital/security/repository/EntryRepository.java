package com.hospital.security.repository;

import com.hospital.security.model.Entry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EntryRepository extends JpaRepository<Entry, Long> {
    
    List<Entry> findByBranchId(Long branchId);
    
    List<Entry> findByBranchIdAndEntryTimeBetween(Long branchId, LocalDateTime startTime, LocalDateTime endTime);
    
    List<Entry> findByBranchIdAndEntryTypeAndEntryTimeBetween(
        Long branchId, String entryType, LocalDateTime startTime, LocalDateTime endTime);
    
    Entry findByEntryId(String entryId);
    
    @Query("SELECT e FROM Entry e WHERE e.branch.id = :branchId AND e.entryTime >= :startOfDay AND e.entryTime <= :endOfDay ORDER BY e.entryTime DESC")
    List<Entry> findTodayEntries(@Param("branchId") Long branchId, 
                                @Param("startOfDay") LocalDateTime startOfDay, 
                                @Param("endOfDay") LocalDateTime endOfDay);
}
