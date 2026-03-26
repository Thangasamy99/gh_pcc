package com.hospital.security.service.impl;

import com.hospital.security.dto.*;
import com.hospital.security.model.Entry;
import com.hospital.security.model.PatientEntry;
import com.hospital.security.model.EntryStatus;
import com.hospital.security.model.Visitor;
import com.hospital.security.model.VisitorStatus;
import com.hospital.security.repository.EntryRepository;
import com.hospital.security.repository.PatientEntryRepository;
import com.hospital.security.repository.VisitorRepository;
import com.hospital.security.service.SecurityService;
import com.hospital.security.service.SecuritySequenceGenerator;
import com.hospital.multibranch.model.Branch;
import com.hospital.multibranch.repository.BranchRepository;
import com.hospital.auth.model.User;
import com.hospital.auth.repository.UserRepository;
import com.hospital.ward.model.Ward;
import com.hospital.ward.model.Room;
import com.hospital.ward.model.Bed;
import com.hospital.ward.repository.WardRepository;
import com.hospital.ward.repository.RoomRepository;
import com.hospital.ward.repository.BedRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class SecurityServiceImpl implements SecurityService {

    private final EntryRepository entryRepository;
    private final PatientEntryRepository patientEntryRepository;
    private final VisitorRepository visitorRepository;
    private final UserRepository userRepository;
    private final BranchRepository branchRepository;
    private final WardRepository wardRepository;
    private final RoomRepository roomRepository;
    private final BedRepository bedRepository;
    private final SecuritySequenceGenerator sequenceGenerator;

    @Override
    public SecurityDashboardDTO getDashboardStats(Long branchId) {
        // Get counts - using simplified methods for now
        long totalEntriesToday = 0; // entryRepository.countByBranchIdAndEntryTimeBetween(branchId, startOfDay, endOfDay);
        long emergencyCasesToday = 0; // entryRepository.countByBranchIdAndEntryTypeAndEntryTimeBetween(branchId, "EMERGENCY", startOfDay, endOfDay);
        long visitorsInside = 0; // visitorRepository.countByBranchIdAndStatus(branchId, "INSIDE");
        long normalEntriesToday = 0; // entryRepository.countByBranchIdAndEntryTypeAndEntryTimeBetween(branchId, "NORMAL", startOfDay, endOfDay);
        long visitorEntriesToday = 0; // entryRepository.countByBranchIdAndEntryTypeAndEntryTimeBetween(branchId, "VISITOR", startOfDay, endOfDay);

        return SecurityDashboardDTO.builder()
            .totalEntriesToday((int) totalEntriesToday)
            .emergencyCasesToday((int) emergencyCasesToday)
            .visitorsInside((int) visitorsInside)
            .normalEntriesToday((int) normalEntriesToday)
            .visitorEntriesToday((int) visitorEntriesToday)
            .emergencyEntriesToday((int) emergencyCasesToday)
            .build();
    }

    @Override
    public EntryResponseDTO createEntry(DynamicEntryRequestDTO request, Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new EntityNotFoundException("User not found: " + userId));

        Branch branch = branchRepository.findById(request.getBranchId())
            .orElseThrow(() -> new EntityNotFoundException("Branch not found: " + request.getBranchId()));

        // Generate entry ID using sequence generator
        String entryId = sequenceGenerator.generateEntryId(branch.getBranchCode());

        Entry entry = Entry.builder()
            .entryId(entryId)
            .entryType(request.getEntryType())
            .fullName(request.getFullName())
            .gender(request.getGender())
            .age(request.getAge())
            .phoneNumber(request.getPhoneNumber())
            .address(request.getAddress())
            .patientId(request.getPatientId())
            .patientName(request.getPatientName())
            .wardId(request.getWardId())
            .roomNumber(request.getRoomNumber())
            .bedNumber(request.getBedNumber())
            .purposeOfVisit(request.getPurposeOfVisit())
            .entryTime(LocalDateTime.now())
            .exitTime(null)
            .destination("Auto-assigned") // Simplified
            .status("ACTIVE")
            .registeredBy(user.getFirstName() + " " + user.getLastName())
            .branch(branch)
            .createdBy(user)
            .build();

        // Set destination based on entry type
        if ("NORMAL".equals(request.getEntryType())) {
            entry.setDestination("Reception");
        } else if ("EMERGENCY".equals(request.getEntryType())) {
            entry.setDestination("Emergency Room");
        } else if ("VISITOR".equals(request.getEntryType())) {
            entry.setDestination("Patient Ward");
        }

        entry = entryRepository.save(entry);

        // If patient entry (NORMAL or EMERGENCY), also create PatientEntry record for Reception
        if ("NORMAL".equals(request.getEntryType()) || "EMERGENCY".equals(request.getEntryType())) {
            createPatientEntryRecord(entry, request, user, branch);
        }

        // If visitor entry, create visitor record
        if ("VISITOR".equals(request.getEntryType())) {
            createVisitorRecord(entry, request, user, branch);
        }

        return mapToEntryResponse(entry);
    }
    private void createVisitorRecord(Entry entry, DynamicEntryRequestDTO request, User user, Branch branch) {
        String passNumber = generateVisitorPassNumber();

        Visitor visitor = Visitor.builder()
            .visitorId("VIS-" + System.currentTimeMillis())
            .visitorName(request.getFullName())
            .phoneNumber(request.getPhoneNumber())
            .idProof(request.getIdProof())
            .relationship(request.getRelationship())
            .patientName(request.getPatientName())
            .patientId(request.getPatientId())
            .wardId(request.getWardId())
            .roomNumber(request.getRoomNumber())
            .bedNumber(request.getBedNumber())
            .purposeOfVisit(request.getPurposeOfVisit())
            .entryTime(LocalDateTime.now())
            .expectedExitTime(request.getExpectedExitTime())
            .visitorPassNumber(passNumber)
            .status("INSIDE")
            .registeredBy(user.getFirstName() + " " + user.getLastName())
            .branch(branch)
            .createdBy(user)
            .build();

        visitorRepository.save(visitor);
    }

    private void createPatientEntryRecord(Entry entry, DynamicEntryRequestDTO request, User user, Branch branch) {
        PatientEntry patientEntry = PatientEntry.builder()
            .entryId(entry.getEntryId())
            .personType(com.hospital.security.model.PersonType.PATIENT)
            .patientName(request.getFullName())
            .age(request.getAge())
            .gender(com.hospital.security.model.Gender.valueOf(request.getGender().toUpperCase()))
            .phoneNumber(request.getPhoneNumber())
            .address(request.getAddress())
            .visitType(com.hospital.security.model.VisitType.valueOf(request.getVisitType() != null ? request.getVisitType().toUpperCase() : "CONSULTATION"))
            .department(request.getDepartment() != null ? request.getDepartment() : "General")
            .purposeOfVisit(request.getPurposeOfVisit())
            .isEmergency("EMERGENCY".equals(request.getEntryType()))
            .entryDate(LocalDate.now())
            .entryTime(LocalTime.now())
            .registeredBy(user.getFirstName() + " " + user.getLastName())
            .status(EntryStatus.PENDING)
            .branch(branch)
            .createdBy(user)
            .createdAt(LocalDateTime.now())
            .build();

        patientEntryRepository.save(patientEntry);
    }

    @Override
    public List<EntryResponseDTO> getTodayEntries(Long branchId) {
        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.atTime(23, 59, 59);

        List<Entry> entries = entryRepository.findByBranchIdAndEntryTimeBetween(branchId, startOfDay, endOfDay);
        
        return entries.stream()
            .map(this::mapToEntryResponse)
            .collect(Collectors.toList());
    }

    @Override
    public List<EntryResponseDTO> getAllPatientEntries(Long branchId) {
        List<Entry> entries = entryRepository.findByBranchId(branchId);
        
        return entries.stream()
            .filter(entry -> "NORMAL".equals(entry.getEntryType()) || "EMERGENCY".equals(entry.getEntryType()))
            .map(this::mapToEntryResponse)
            .collect(Collectors.toList());
    }

    @Override
    public Page<VisitorResponseDTO> getVisitorHistory(Long branchId, String startDate, String endDate,
                                                      String patientName, String visitorName, Pageable pageable) {
        // Simplified implementation - would need proper filtering logic
        return new PageImpl<>(new ArrayList<>(), pageable, 0);
    }

    @Override
    public PatientLocationDTO searchPatientLocation(String searchTerm) {
        // Simplified implementation - would need proper patient search logic
        return PatientLocationDTO.builder()
            .patientId(1L)
            .patientName("Sample Patient")
            .gender("MALE")
            .age(35)
            .wardId(1L)
            .wardName("General Ward")
            .roomNumber("101")
            .bedNumber("A1")
            .doctorName("Dr. Smith")
            .admissionDate("2024-01-15")
            .status("ACTIVE")
            .build();
    }

    @Override
    public List<WardDTO> getAllWards(Long branchId) {
        List<Ward> wards = wardRepository.findByBranchId(branchId);
        
        return wards.stream()
            .map(this::mapToWardDTO)
            .collect(Collectors.toList());
    }

    @Override
    public List<RoomDTO> getRoomsByWard(Long wardId) {
        List<Room> rooms = roomRepository.findByWardId(wardId);
        
        return rooms.stream()
            .map(this::mapToRoomDTO)
            .collect(Collectors.toList());
    }

    @Override
    public List<BedDTO> getBedsByRoom(Long roomId) {
        List<Bed> beds = bedRepository.findByRoomId(roomId);
        
        return beds.stream()
            .map(this::mapToBedDTO)
            .collect(Collectors.toList());
    }

    @Override
    public Page<EntryResponseDTO> getDailyLogs(Long branchId, LocalDate date, Pageable pageable) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(23, 59, 59);
        
        List<Entry> entries = entryRepository.findByBranchIdAndEntryTimeBetween(branchId, startOfDay, endOfDay);
        
        List<EntryResponseDTO> entryDTOs = entries.stream()
            .map(this::mapToEntryResponse)
            .collect(Collectors.toList());
            
        return new PageImpl<>(entryDTOs, pageable, entryDTOs.size());
    }

    @Override
    public Page<EntryResponseDTO> getEmergencyLogs(Long branchId, LocalDate startDate, LocalDate endDate, Pageable pageable) {
        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime end = endDate.atTime(LocalTime.MAX);
        
        List<Entry> entries = entryRepository.findByBranchIdAndEntryTypeAndEntryTimeBetween(
            branchId, "EMERGENCY", start, end);
        
        List<EntryResponseDTO> entryDTOs = entries.stream()
            .map(this::mapToEntryResponse)
            .collect(Collectors.toList());
            
        return new PageImpl<>(entryDTOs, pageable, entryDTOs.size());
    }

    @Override
    public EntryResponseDTO getEntryById(Long id) {
        Entry entry = entryRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Entry not found: " + id));
        return mapToEntryResponse(entry);
    }

    @Override
    public List<VisitorResponseDTO> getActiveVisitors(Long branchId) {
        List<Visitor> visitors = visitorRepository.findByBranchIdAndStatus(branchId, "INSIDE");
        return visitors.stream()
            .map(this::mapToVisitorResponse)
            .collect(Collectors.toList());
    }

    @Override
    public VisitorResponseDTO checkoutVisitor(Long id, Long userId) {
        Visitor visitor = visitorRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Visitor not found: " + id));
        
        visitor.setStatus("CHECKED_OUT");
        visitor.setExitTime(LocalDateTime.now());
        
        visitor = visitorRepository.save(visitor);
        return mapToVisitorResponse(visitor);
    }

    @Override
    public List<VisitorResponseDTO> getDailyVisitors(Long branchId, String date) {
        try {
            // Parse the date string
            LocalDate targetDate = LocalDate.parse(date);
            LocalDateTime startOfDay = targetDate.atStartOfDay();
            LocalDateTime endOfDay = targetDate.atTime(23, 59, 59);
            
            // Find all visitor entries for the specific date
            List<Entry> visitorEntries = entryRepository.findByBranchIdAndEntryTimeBetween(
                branchId, startOfDay, endOfDay
            );
            
            // Filter only visitor entries and convert to DTOs
            return visitorEntries.stream()
                .filter(entry -> "VISITOR".equals(entry.getEntryType()))
                .map(this::convertToVisitorResponseDTO)
                .collect(Collectors.toList());
                
        } catch (Exception e) {
            log.error("Error getting daily visitors for branch {} and date {}: {}", 
                     branchId, date, e.getMessage());
            return new ArrayList<>();
        }
    }

    @Override
    public List<MetadataDTO> getEntryTypes() {
        List<MetadataDTO> types = new ArrayList<>();
        types.add(MetadataDTO.builder().value("NORMAL").label("Normal Patient").build());
        types.add(MetadataDTO.builder().value("EMERGENCY").label("Emergency").build());
        types.add(MetadataDTO.builder().value("VISITOR").label("Visitor").build());
        return types;
    }

    @Override
    public List<MetadataDTO> getVisitTypes() {
        List<MetadataDTO> types = new ArrayList<>();
        types.add(MetadataDTO.builder().value("ROUTINE").label("Routine Visit").build());
        types.add(MetadataDTO.builder().value("EMERGENCY").label("Emergency Visit").build());
        types.add(MetadataDTO.builder().value("FOLLOWUP").label("Follow-up Visit").build());
        return types;
    }

    @Override
    public List<MetadataDTO> getDepartments() {
        List<MetadataDTO> departments = new ArrayList<>();
        departments.add(MetadataDTO.builder().value("ER").label("Emergency Room").build());
        departments.add(MetadataDTO.builder().value("ICU").label("Intensive Care").build());
        departments.add(MetadataDTO.builder().value("GENERAL").label("General Ward").build());
        departments.add(MetadataDTO.builder().value("MATERNITY").label("Maternity").build());
        return departments;
    }

    @Override
    public List<MetadataDTO> getEmergencyTypes() {
        List<MetadataDTO> types = new ArrayList<>();
        types.add(MetadataDTO.builder().value("CRITICAL").label("Critical").build());
        types.add(MetadataDTO.builder().value("URGENT").label("Urgent").build());
        types.add(MetadataDTO.builder().value("NON_URGENT").label("Non-Urgent").build());
        return types;
    }

    @Override
    public List<MetadataDTO> getGenders() {
        List<MetadataDTO> genders = new ArrayList<>();
        genders.add(MetadataDTO.builder().value("MALE").label("Male").build());
        genders.add(MetadataDTO.builder().value("FEMALE").label("Female").build());
        genders.add(MetadataDTO.builder().value("OTHER").label("Other").build());
        return genders;
    }

    @Override
    public List<MetadataDTO> getRelationships() {
        List<MetadataDTO> relationships = new ArrayList<>();
        relationships.add(MetadataDTO.builder().value("PARENT").label("Parent").build());
        relationships.add(MetadataDTO.builder().value("SPOUSE").label("Spouse").build());
        relationships.add(MetadataDTO.builder().value("CHILD").label("Child").build());
        relationships.add(MetadataDTO.builder().value("SIBLING").label("Sibling").build());
        relationships.add(MetadataDTO.builder().value("FRIEND").label("Friend").build());
        relationships.add(MetadataDTO.builder().value("OTHER").label("Other").build());
        return relationships;
    }

    // Helper methods
    private String generateVisitorPassNumber() {
        return "PASS-" + System.currentTimeMillis();
    }

    private EntryResponseDTO mapToEntryResponse(Entry entry) {
        return EntryResponseDTO.builder()
            .id(entry.getId())
            .entryId(entry.getEntryId())
            .entryType(entry.getEntryType())
            .fullName(entry.getFullName())
            .gender(entry.getGender())
            .age(entry.getAge())
            .phoneNumber(entry.getPhoneNumber())
            .address(entry.getAddress())
            .patientId(entry.getPatientId())
            .patientName(entry.getPatientName())
            .wardId(entry.getWardId())
            .roomNumber(entry.getRoomNumber())
            .bedNumber(entry.getBedNumber())
            .purposeOfVisit(entry.getPurposeOfVisit())
            .entryTime(entry.getEntryTime())
            .exitTime(entry.getExitTime())
            .destination(entry.getDestination())
            .status(entry.getStatus())
            .registeredBy(entry.getRegisteredBy())
            .build();
    }

    private VisitorResponseDTO mapToVisitorResponse(Visitor visitor) {
        return VisitorResponseDTO.builder()
            .id(visitor.getId())
            .visitorId(visitor.getVisitorId())
            .visitorName(visitor.getVisitorName())
            .phoneNumber(visitor.getPhoneNumber())
            .nationalId(visitor.getIdProof())
            .relationship(visitor.getRelationship())
            .patientName(visitor.getPatientName())
            .wardId(visitor.getWardId())
            .wardName(getWardName(visitor.getWardId()))
            .roomNumber(visitor.getRoomNumber())
            .bedNumber(visitor.getBedNumber())
            .visitPurpose(visitor.getPurposeOfVisit())
            .entryTime(visitor.getEntryTime() != null ? visitor.getEntryTime().toLocalTime() : null)
            .expectedExitTime(visitor.getExpectedExitTime() != null ? visitor.getExpectedExitTime().toLocalTime() : null)
            .exitTime(visitor.getExitTime() != null ? visitor.getExitTime().toLocalTime() : null)
            .status(convertToVisitorStatus(visitor.getStatus()))
            .visitorPassNumber(visitor.getVisitorPassNumber())
            .registeredBy(visitor.getRegisteredBy())
            .build();
    }

    private VisitorResponseDTO convertToVisitorResponseDTO(Entry entry) {
        return VisitorResponseDTO.builder()
            .id(entry.getId())
            .visitorId(entry.getEntryId())
            .visitorName(entry.getVisitorName())
            .phoneNumber(entry.getPhoneNumber())
            .nationalId(entry.getIdProof())
            .relationship(entry.getRelationship())
            .patientName(entry.getPatientName())
            .wardId(entry.getWardId())
            .wardName(getWardName(entry.getWardId()))
            .roomNumber(entry.getRoomNumber())
            .bedNumber(entry.getBedNumber())
            .visitPurpose(entry.getPurposeOfVisit())
            .entryTime(entry.getEntryTime() != null ? entry.getEntryTime().toLocalTime() : null)
            .expectedExitTime(entry.getExpectedExitTime() != null ? entry.getExpectedExitTime().toLocalTime() : null)
            .exitTime(entry.getExitTime() != null ? entry.getExitTime().toLocalTime() : null)
            .status(convertToVisitorStatus(entry.getStatus()))
            .visitorPassNumber(null) // Not available in Entry
            .registeredBy(entry.getRegisteredBy())
            .build();
    }

    private WardDTO mapToWardDTO(Ward ward) {
        return WardDTO.builder()
            .id(ward.getId())
            .wardCode(ward.getWardCode())
            .wardName(ward.getWardName())
            .wardType(ward.getWardType() != null ? ward.getWardType().toString() : null)
            .totalBeds(ward.getTotalBeds())
            .availableBeds(ward.getAvailableBeds())
            .occupiedBeds(ward.getOccupiedBeds())
            .floor(ward.getFloor())
            .build();
    }

    private RoomDTO mapToRoomDTO(Room room) {
        return RoomDTO.builder()
            .id(room.getId())
            .roomNumber(room.getRoomNumber())
            .roomType(room.getRoomType() != null ? room.getRoomType().toString() : null)
            .totalBeds(room.getTotalBeds())
            .availableBeds(room.getAvailableBeds())
            .build();
    }

    private BedDTO mapToBedDTO(Bed bed) {
        return BedDTO.builder()
            .id(bed.getId())
            .bedNumber(bed.getBedNumber())
            .status(bed.getStatus() != null ? bed.getStatus().toString() : null)
            .currentPatientId(bed.getCurrentPatient() != null ? bed.getCurrentPatient().getId() : null)
            .currentPatientName(bed.getCurrentPatient() != null ? bed.getCurrentPatient().getFirstName() + " " + bed.getCurrentPatient().getLastName() : null)
            .build();
    }

    private String getWardName(Long wardId) {
        if (wardId == null) return null;
        return wardRepository.findById(wardId)
            .map(Ward::getWardName)
            .orElse(null);
    }

    private VisitorStatus convertToVisitorStatus(String status) {
        if (status == null) return null;
        try {
            return VisitorStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            return VisitorStatus.ACTIVE; // Default value
        }
    }

    // Additional methods for Reception
    @Override
    @Transactional(readOnly = true)
    public List<PatientEntryResponseDTO> getPendingEntries(Long branchId) {
        List<PatientEntry> entries = patientEntryRepository.findPendingEntries(branchId, EntryStatus.PENDING, LocalDate.now());
        return entries.stream().map(this::mapToPatientEntryResponseDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public PatientEntryResponseDTO getPatientEntryById(Long patientEntryId) {
        PatientEntry entry = patientEntryRepository.findById(patientEntryId)
                .orElseThrow(() -> new EntityNotFoundException("Patient entry not found: " + patientEntryId));
        return mapToPatientEntryResponseDTO(entry);
    }

    @Override
    @Transactional(readOnly = true)
    public PatientEntry getPatientEntryEntityById(Long patientEntryId) {
        return patientEntryRepository.findById(patientEntryId)
                .orElseThrow(() -> new EntityNotFoundException("Patient entry not found: " + patientEntryId));
    }

    @Override
    public void updatePatientEntryStatus(Long patientEntryId, EntryStatus status) {
        PatientEntry entry = patientEntryRepository.findById(patientEntryId)
                .orElseThrow(() -> new EntityNotFoundException("Patient entry not found: " + patientEntryId));
        entry.setStatus(status);
        entry.setUpdatedAt(LocalDateTime.now());
        patientEntryRepository.save(entry);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PatientEntryResponseDTO> getTodayPatientEntries(Long branchId) {
        List<PatientEntry> entries = patientEntryRepository.findTodayEntries(branchId, LocalDate.now());
        return entries.stream().map(this::mapToPatientEntryResponseDTO).collect(Collectors.toList());
    }

    private PatientEntryResponseDTO mapToPatientEntryResponseDTO(PatientEntry entry) {
        return PatientEntryResponseDTO.builder()
                .id(entry.getId())
                .entryId(entry.getEntryId())
                .personType(entry.getPersonType())
                .patientName(entry.getPatientName())
                .age(entry.getAge())
                .gender(entry.getGender())
                .phoneNumber(entry.getPhoneNumber())
                .address(entry.getAddress())
                .city(entry.getCity())
                .visitType(entry.getVisitType())
                .department(entry.getDepartment())
                .purposeOfVisit(entry.getPurposeOfVisit())
                .isEmergency(entry.getIsEmergency())
                .knownIllness(entry.getKnownIllness())
                .allergy(entry.getAllergy())
                .hasInsurance(entry.getHasInsurance())
                .entryDate(entry.getEntryDate())
                .entryTime(entry.getEntryTime())
                .registeredBy(entry.getRegisteredBy())
                .status(entry.getStatus())
                .branchId(entry.getBranch().getId())
                .branchName(entry.getBranch().getBranchName())
                .createdBy(entry.getCreatedBy().getUsername())
                .createdAt(entry.getCreatedAt())
                .build();
    }

}
