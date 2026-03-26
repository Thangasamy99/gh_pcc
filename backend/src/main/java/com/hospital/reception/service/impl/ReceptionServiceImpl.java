package com.hospital.reception.service.impl;

import com.hospital.auth.model.User;
import com.hospital.auth.repository.UserRepository;
import com.hospital.multibranch.model.Branch;
import com.hospital.multibranch.repository.BranchRepository;
import com.hospital.reception.dto.*;
import com.hospital.reception.model.PatientVitals;
import com.hospital.reception.model.ReceptionQueue;
import com.hospital.reception.repository.PatientVitalsRepository;
import com.hospital.reception.repository.ReceptionQueueRepository;
import com.hospital.reception.service.ReceptionService;
import com.hospital.security.dto.PatientEntryResponseDTO;
import com.hospital.security.model.EntryStatus;
import com.hospital.security.model.PatientEntry;
import com.hospital.security.model.VisitType;
import com.hospital.security.service.SecurityService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ReceptionServiceImpl implements ReceptionService {

    private final ReceptionQueueRepository queueRepository;
    private final PatientVitalsRepository vitalsRepository;
    private final SecurityService securityService;
    private final UserRepository userRepository;
    private final BranchRepository branchRepository;

    @Override
    @Transactional(readOnly = true)
    public ReceptionDashboardDTO getDashboardData(Long branchId) {
        LocalDate today = LocalDate.now();
        
        Long totalPatientsToday = queueRepository.countByBranchAndDate(branchId, today);
        Long waitingQueue = queueRepository.countByBranchAndDateAndStatus(branchId, today, ReceptionQueue.QueueStatus.WAITING);
        Long vitalsCompleted = queueRepository.countByBranchAndDateAndStatus(branchId, today, ReceptionQueue.QueueStatus.VITALS_COMPLETED);
        Long sentToCashier = queueRepository.countByBranchAndDateAndStatus(branchId, today, ReceptionQueue.QueueStatus.SENT_TO_CASHIER);
        Long paymentCompleted = queueRepository.countByBranchAndDateAndStatus(branchId, today, ReceptionQueue.QueueStatus.PAYMENT_COMPLETED);
        Long sentToDoctor = queueRepository.countByBranchAndDateAndStatus(branchId, today, ReceptionQueue.QueueStatus.SENT_TO_DOCTOR);

        Long emergencyCases = vitalsRepository.countByBranchAndDateAndTriageStatus(branchId, today, PatientVitals.TriageStatus.EMERGENCY);
        Long urgentCases = vitalsRepository.countByBranchAndDateAndTriageStatus(branchId, today, PatientVitals.TriageStatus.URGENT);
        Long normalCases = vitalsRepository.countByBranchAndDateAndTriageStatus(branchId, today, PatientVitals.TriageStatus.NORMAL);

        // Get patient demographics from security entries
        List<PatientEntryResponseDTO> todayPatients = securityService.getTodayPatientEntries(branchId);
        Long malePatients = todayPatients.stream().filter(p -> p.getGender() == com.hospital.security.model.Gender.MALE).count();
        Long femalePatients = todayPatients.stream().filter(p -> p.getGender() == com.hospital.security.model.Gender.FEMALE).count();
        Long otherGenderPatients = todayPatients.stream().filter(p -> p.getGender() == com.hospital.security.model.Gender.OTHER).count();

        Long consultationPatients = todayPatients.stream().filter(p -> p.getVisitType() == VisitType.CONSULTATION).count();
        Long followUpPatients = todayPatients.stream().filter(p -> p.getVisitType() == VisitType.FOLLOW_UP).count();
        Long emergencyPatients = todayPatients.stream().filter(p -> p.getVisitType() == VisitType.EMERGENCY).count();

        return ReceptionDashboardDTO.builder()
                .totalPatientsToday(totalPatientsToday)
                .waitingQueue(waitingQueue)
                .vitalsCompleted(vitalsCompleted)
                .sentToCashier(sentToCashier)
                .paymentCompleted(paymentCompleted)
                .sentToDoctor(sentToDoctor)
                .emergencyCases(emergencyCases)
                .urgentCases(urgentCases)
                .normalCases(normalCases)
                .malePatients(malePatients)
                .femalePatients(femalePatients)
                .otherGenderPatients(otherGenderPatients)
                .consultationPatients(consultationPatients)
                .followUpPatients(followUpPatients)
                .emergencyPatients(emergencyPatients)
                .lastUpdated(LocalDateTime.now())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PatientEntryResponseDTO> getPendingPatients(Long branchId) {
        return securityService.getPendingEntries(branchId);
    }

    @Override
    @Transactional(readOnly = true)
    public PatientEntryResponseDTO getPatientEntryById(Long patientEntryId) {
        return securityService.getPatientEntryById(patientEntryId);
    }

    @Override
    public ReceptionQueueDTO addPatientToQueue(Long patientEntryId, Long branchId, String managedBy) {
        PatientEntry patientEntry = securityService.getPatientEntryEntityById(patientEntryId);
        Branch branch = branchRepository.findById(branchId)
                .orElseThrow(() -> new RuntimeException("Branch not found"));
        User manager = userRepository.findByUsername(managedBy)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if already in queue
        if (queueRepository.findByPatientEntryId(patientEntryId).isPresent()) {
            throw new RuntimeException("Patient already in queue");
        }

        // Generate queue number
        Integer maxQueueNumber = queueRepository.findMaxQueueNumberByBranchAndDate(branchId, LocalDate.now());
        Integer queueNumber = (maxQueueNumber != null ? maxQueueNumber : 0) + 1;

        ReceptionQueue queue = ReceptionQueue.builder()
                .patientEntry(patientEntry)
                .queueStatus(ReceptionQueue.QueueStatus.WAITING)
                .queueNumber(queueNumber)
                .managedBy(manager)
                .branch(branch)
                .build();

        queue = queueRepository.save(queue);

        // Update patient entry status
        patientEntry.setStatus(EntryStatus.IN_RECEPTION);
        securityService.updatePatientEntryStatus(patientEntryId, EntryStatus.IN_RECEPTION);

        return convertToQueueDTO(queue);
    }

    @Override
    public PatientVitalsDTO recordVitals(PatientVitalsDTO vitalsDTO, Long branchId, String recordedBy) {
        PatientEntry patientEntry = securityService.getPatientEntryEntityById(vitalsDTO.getPatientEntryId());
        Branch branch = branchRepository.findById(branchId)
                .orElseThrow(() -> new RuntimeException("Branch not found"));
        User recorder = userRepository.findByUsername(recordedBy)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if vitals already recorded
        if (vitalsRepository.findByPatientEntryId(vitalsDTO.getPatientEntryId()).isPresent()) {
            throw new RuntimeException("Vitals already recorded for this patient");
        }

        PatientVitals vitals = PatientVitals.builder()
                .patientEntry(patientEntry)
                .weightKg(vitalsDTO.getWeightKg())
                .heightCm(vitalsDTO.getHeightCm())
                .temperatureCelsius(vitalsDTO.getTemperatureCelsius())
                .pulseRateBpm(vitalsDTO.getPulseRateBpm())
                .bloodPressureSystolic(vitalsDTO.getBloodPressureSystolic())
                .bloodPressureDiastolic(vitalsDTO.getBloodPressureDiastolic())
                .respirationRate(vitalsDTO.getRespirationRate())
                .oxygenSaturation(vitalsDTO.getOxygenSaturation())
                .triageStatus(vitalsDTO.getTriageStatus())
                .notes(vitalsDTO.getNotes())
                .recordedBy(recorder)
                .branch(branch)
                .build();

        vitals = vitalsRepository.save(vitals);

        // Update queue status
        ReceptionQueue queue = queueRepository.findByPatientEntryId(vitalsDTO.getPatientEntryId())
                .orElseThrow(() -> new RuntimeException("Patient not found in queue"));
        queue.setQueueStatus(ReceptionQueue.QueueStatus.VITALS_COMPLETED);
        queue.setVitalsCompleted(true);
        queue.setVitalsTime(LocalDateTime.now());
        queueRepository.save(queue);

        return convertToVitalsDTO(vitals);
    }

    @Override
    @Transactional(readOnly = true)
    public PatientVitalsDTO getPatientVitals(Long patientEntryId) {
        PatientVitals vitals = vitalsRepository.findByPatientEntryId(patientEntryId)
                .orElseThrow(() -> new RuntimeException("Vitals not found for this patient"));
        return convertToVitalsDTO(vitals);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PatientVitalsDTO> getTodayVitals(Long branchId) {
        LocalDate today = LocalDate.now();
        List<PatientVitals> vitalsList = vitalsRepository.findByBranchIdAndCreatedAtBetween(branchId, today.atStartOfDay(), today.plusDays(1).atStartOfDay());
        return vitalsList.stream().map(this::convertToVitalsDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReceptionQueueDTO> getWaitingQueue(Long branchId) {
        List<ReceptionQueue> queue = queueRepository.findByBranchIdAndQueueStatusOrderByQueueNumberAsc(branchId, ReceptionQueue.QueueStatus.WAITING);
        return queue.stream().map(this::convertToQueueDTO).collect(Collectors.toList());
    }

    @Override
    public ReceptionQueueDTO sendToCashier(Long patientEntryId, Long branchId, String managedBy) {
        ReceptionQueue queue = queueRepository.findByPatientEntryId(patientEntryId)
                .orElseThrow(() -> new RuntimeException("Patient not found in queue"));
        
        if (!queue.getVitalsCompleted()) {
            throw new RuntimeException("Vitals must be completed before sending to cashier");
        }

        queue.setQueueStatus(ReceptionQueue.QueueStatus.SENT_TO_CASHIER);
        queue.setSentToCashier(true);
        queue.setCashierTime(LocalDateTime.now());
        queueRepository.save(queue);

        // Update patient entry status
        securityService.updatePatientEntryStatus(patientEntryId, EntryStatus.AT_CASHIER);

        return convertToQueueDTO(queue);
    }

    @Override
    public ReceptionQueueDTO assignConsultationRoom(Long patientEntryId, String consultationRoom, Long branchId, String managedBy) {
        return assignConsultationRoomWithDoctor(patientEntryId, consultationRoom, null, branchId, managedBy);
    }

    public ReceptionQueueDTO assignConsultationRoomWithDoctor(Long patientEntryId, String consultationRoom, Long doctorId, Long branchId, String managedBy) {
        ReceptionQueue queue = queueRepository.findByPatientEntryId(patientEntryId)
                .orElseThrow(() -> new RuntimeException("Patient not found in queue"));
        
        if (!queue.getPaymentCompleted()) {
            throw new RuntimeException("Payment must be completed before assigning consultation room");
        }

        queue.setQueueStatus(ReceptionQueue.QueueStatus.ASSIGNED_ROOM);
        queue.setConsultationRoom(consultationRoom);
        
        if (doctorId != null) {
            User doctor = userRepository.findById(doctorId)
                    .orElseThrow(() -> new RuntimeException("Doctor not found"));
            queue.setAssignedDoctor(doctor);
            
            // Update doctor status
            doctor.setAvailabilityStatus(User.AvailabilityStatus.BUSY);
            userRepository.save(doctor);
        }
        
        queueRepository.save(queue);

        return convertToQueueDTO(queue);
    }

    @Override
    public ReceptionQueueDTO sendToDoctor(Long patientEntryId, Long branchId, String managedBy) {
        ReceptionQueue queue = queueRepository.findByPatientEntryId(patientEntryId)
                .orElseThrow(() -> new RuntimeException("Patient not found in queue"));
        
        if (queue.getConsultationRoom() == null) {
            throw new RuntimeException("Consultation room must be assigned before sending to doctor");
        }

        queue.setQueueStatus(ReceptionQueue.QueueStatus.SENT_TO_DOCTOR);
        queue.setSentToDoctor(true);
        queue.setDoctorTime(LocalDateTime.now());
        queueRepository.save(queue);

        // Update patient entry status
        securityService.updatePatientEntryStatus(patientEntryId, EntryStatus.IN_CONSULTATION);

        return convertToQueueDTO(queue);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReceptionQueueDTO> getTodayQueue(Long branchId) {
        List<ReceptionQueue> queue = queueRepository.findByBranchIdOrderByQueueNumberAsc(branchId);
        return queue.stream().map(this::convertToQueueDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PatientEntryResponseDTO> getTodayPatients(Long branchId) {
        return securityService.getTodayPatientEntries(branchId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReceptionQueueDTO> getPatientsByStatus(ReceptionQueue.QueueStatus status, Long branchId) {
        List<ReceptionQueue> queue = queueRepository.findByBranchIdAndQueueStatusOrderByQueueNumberAsc(branchId, status);
        return queue.stream().map(this::convertToQueueDTO).collect(Collectors.toList());
    }

    // Helper methods for conversion
    private ReceptionQueueDTO convertToQueueDTO(ReceptionQueue queue) {
        PatientEntry entry = queue.getPatientEntry();
        return ReceptionQueueDTO.builder()
                .id(queue.getId())
                .patientEntryId(entry.getId())
                .entryId(entry.getEntryId())
                .patientName(entry.getPatientName())
                .age(entry.getAge())
                .gender(entry.getGender())
                .phoneNumber(entry.getPhoneNumber())
                .visitType(entry.getVisitType())
                .department(entry.getDepartment())
                .queueStatus(queue.getQueueStatus())
                .queueNumber(queue.getQueueNumber())
                .vitalsCompleted(queue.getVitalsCompleted())
                .sentToCashier(queue.getSentToCashier())
                .paymentCompleted(queue.getPaymentCompleted())
                .consultationRoom(queue.getConsultationRoom())
                .assignedDoctorId(queue.getAssignedDoctor() != null ? queue.getAssignedDoctor().getId() : null)
                .assignedDoctorName(queue.getAssignedDoctor() != null ? "Dr. " + queue.getAssignedDoctor().getFirstName() + " " + queue.getAssignedDoctor().getLastName() : null)
                .sentToDoctor(queue.getSentToDoctor())
                .queueTime(queue.getQueueTime())
                .vitalsTime(queue.getVitalsTime())
                .cashierTime(queue.getCashierTime())
                .doctorTime(queue.getDoctorTime())
                .notes(queue.getNotes())
                .managedBy(queue.getManagedBy().getUsername())
                .branchId(queue.getBranch().getId())
                .entryDate(entry.getEntryDate())
                .entryTime(entry.getEntryTime())
                .createdAt(queue.getCreatedAt())
                .build();
    }

    private PatientVitalsDTO convertToVitalsDTO(PatientVitals vitals) {
        PatientEntry entry = vitals.getPatientEntry();
        return PatientVitalsDTO.builder()
                .id(vitals.getId())
                .patientEntryId(entry.getId())
                .entryId(entry.getEntryId())
                .patientName(entry.getPatientName())
                .weightKg(vitals.getWeightKg())
                .heightCm(vitals.getHeightCm())
                .temperatureCelsius(vitals.getTemperatureCelsius())
                .pulseRateBpm(vitals.getPulseRateBpm())
                .bloodPressureSystolic(vitals.getBloodPressureSystolic())
                .bloodPressureDiastolic(vitals.getBloodPressureDiastolic())
                .respirationRate(vitals.getRespirationRate())
                .oxygenSaturation(vitals.getOxygenSaturation())
                .triageStatus(vitals.getTriageStatus())
                .notes(vitals.getNotes())
                .recordedBy(vitals.getRecordedBy().getUsername())
                .branchId(vitals.getBranch().getId())
                .createdAt(vitals.getCreatedAt())
                .build();
    }
}
