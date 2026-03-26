package com.hospital.security.service;

import com.hospital.security.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface SecurityService {
    
    // Dashboard
    SecurityDashboardDTO getDashboardStats(Long branchId);
    
    // Dynamic Entry
    EntryResponseDTO createEntry(DynamicEntryRequestDTO request, Long userId);
    List<EntryResponseDTO> getTodayEntries(Long branchId);
    List<PatientEntryResponseDTO> getTodayPatientEntries(Long branchId);
    EntryResponseDTO getEntryById(Long id);
    List<EntryResponseDTO> getAllPatientEntries(Long branchId);
    
    // Visitor Management
    List<VisitorResponseDTO> getActiveVisitors(Long branchId);
    VisitorResponseDTO checkoutVisitor(Long id, Long userId);
    Page<VisitorResponseDTO> getVisitorHistory(Long branchId, String startDate, String endDate, 
                                                      String patientName, String visitorName, Pageable pageable);
    List<VisitorResponseDTO> getDailyVisitors(Long branchId, String date);
    
    // Patient Location
    PatientLocationDTO searchPatientLocation(String searchTerm);
    
    // Ward Management
    List<WardDTO> getAllWards(Long branchId);
    List<RoomDTO> getRoomsByWard(Long wardId);
    List<BedDTO> getBedsByRoom(Long roomId);
    
    // Logs & Reports
    Page<EntryResponseDTO> getDailyLogs(Long branchId, LocalDate date, Pageable pageable);
    Page<EntryResponseDTO> getEmergencyLogs(Long branchId, LocalDate startDate, LocalDate endDate, Pageable pageable);
    
    // Metadata
    List<MetadataDTO> getEntryTypes();
    List<MetadataDTO> getVisitTypes();
    List<MetadataDTO> getDepartments();
    List<MetadataDTO> getEmergencyTypes();
    List<MetadataDTO> getGenders();
    List<MetadataDTO> getRelationships();
    
    // Additional methods for Reception
    List<PatientEntryResponseDTO> getPendingEntries(Long branchId);
    PatientEntryResponseDTO getPatientEntryById(Long patientEntryId);
    com.hospital.security.model.PatientEntry getPatientEntryEntityById(Long patientEntryId);
    void updatePatientEntryStatus(Long patientEntryId, com.hospital.security.model.EntryStatus status);
}
