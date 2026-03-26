package com.hospital.branchadmin.service.impl;

import com.hospital.auth.model.User;
import com.hospital.auth.repository.UserRepository;
import com.hospital.billing.repository.PaymentRepository;
import com.hospital.branchadmin.dto.BranchAdminDashboardDTO;
import com.hospital.branchadmin.service.api.BranchAdminService;
import com.hospital.consultation.repository.ConsultationRepository;
import com.hospital.multibranch.model.Branch;
import com.hospital.multibranch.repository.BranchRepository;
import com.hospital.reception.model.ReceptionQueue;
import com.hospital.reception.repository.ReceptionQueueRepository;
import com.hospital.security.model.Entry;
import com.hospital.security.repository.EntryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class BranchAdminServiceImpl implements BranchAdminService {

    private final BranchRepository branchRepository;
    private final UserRepository userRepository;
    private final ReceptionQueueRepository queueRepository;
    private final PaymentRepository paymentRepository;
    private final ConsultationRepository consultationRepository;
    private final EntryRepository entryRepository;

    @Override
    public BranchAdminDashboardDTO getDashboard(Long branchId) {
        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.atTime(LocalTime.MAX);

        Long totalPatientsToday = 0L;
        try {
            totalPatientsToday = entryRepository.findByBranchIdAndEntryTypeAndEntryTimeBetween(
                branchId, "NORMAL", startOfDay, endOfDay).stream().count();
        } catch (Exception e) {
            log.error("Error fetching totalPatientsToday: {}", e.getMessage());
        }
        
        Long waitingPatients = 0L;
        try {
            waitingPatients = queueRepository.countByBranchAndDateAndStatus(
                branchId, today, ReceptionQueue.QueueStatus.WAITING);
            if (waitingPatients == null) waitingPatients = 0L;
        } catch (Exception e) {
            log.error("Error fetching waitingPatients: {}", e.getMessage());
        }
        
        Long paidPatients = 0L;
        try {
            paidPatients = queueRepository.countByBranchAndDateAndStatus(
                branchId, today, ReceptionQueue.QueueStatus.PAYMENT_COMPLETED);
            if (paidPatients == null) paidPatients = 0L;
        } catch (Exception e) {
            log.error("Error fetching paidPatients: {}", e.getMessage());
        }
        
        Long inConsultation = 0L;
        try {
            inConsultation = queueRepository.countByBranchAndDateAndStatus(
                branchId, today, ReceptionQueue.QueueStatus.SENT_TO_DOCTOR);
            if (inConsultation == null) inConsultation = 0L;
        } catch (Exception e) {
            log.error("Error fetching inConsultation: {}", e.getMessage());
        }
        
        Double revenue = 0.0;
        try {
            revenue = paymentRepository.sumAmountByBranchAndDate(branchId, today);
            if (revenue == null) revenue = 0.0;
        } catch (Exception e) {
            log.error("Error fetching revenue: {}", e.getMessage());
        }

        Map<String, Long> queueStatus = new HashMap<>();
        queueStatus.put("Reception", waitingPatients);
        queueStatus.put("Doctor", inConsultation);
        try {
            Long cashierWaiting = queueRepository.countByBranchAndDateAndStatus(branchId, today, ReceptionQueue.QueueStatus.SENT_TO_CASHIER);
            queueStatus.put("Cashier", cashierWaiting != null ? cashierWaiting : 0L);
        } catch (Exception e) {
            log.error("Error fetching cashierWaiting: {}", e.getMessage());
            queueStatus.put("Cashier", 0L);
        }

        Map<String, Long> staffAvailability = new HashMap<>();
        try {
            staffAvailability.put("Active Doctors", (long) userRepository.findActiveByBranchId(branchId).stream()
                .filter(u -> u.getRole() != null && u.getRole().getRoleCode() != null && u.getRole().getRoleCode().contains("DOCTOR")).count());
        } catch (Exception e) {
            log.error("Error fetching staffAvailability: {}", e.getMessage());
            staffAvailability.put("Active Doctors", 0L);
        }

        return BranchAdminDashboardDTO.builder()
                .totalPatientsToday(totalPatientsToday)
                .waitingPatients(waitingPatients)
                .paidPatients(paidPatients)
                .patientsInConsultation(inConsultation)
                .admissionsToday(0L) // TODO: Implement Admission module
                .totalRevenueToday(revenue)
                .queueStatus(queueStatus)
                .staffAvailability(staffAvailability)
                .recentActivities(new ArrayList<>()) // Placeholder
                .build();
    }

    @Override
    public List<Map<String, Object>> trackPatients(Long branchId) {
        LocalDate today = LocalDate.now();
        LocalDateTime start = today.atStartOfDay();
        LocalDateTime end = today.atTime(LocalTime.MAX);
        
        List<Entry> entries = entryRepository.findTodayEntries(branchId, start, end);
        
        return entries.stream().map(e -> {
            Map<String, Object> map = new HashMap<>();
            map.put("patientId", e.getEntryId());
            map.put("name", e.getFullName());
            map.put("currentStage", e.getDestination());
            map.put("status", e.getStatus());
            return map;
        }).collect(Collectors.toList());
    }

    @Override
    public Map<String, Integer> getQueues(Long branchId) {
        LocalDate today = LocalDate.now();
        Map<String, Integer> queues = new HashMap<>();
        
        try {
            Long reception = queueRepository.countByBranchAndDateAndStatus(branchId, today, ReceptionQueue.QueueStatus.WAITING);
            queues.put("Reception", reception != null ? reception.intValue() : 0);
            
            Long cashier = queueRepository.countByBranchAndDateAndStatus(branchId, today, ReceptionQueue.QueueStatus.SENT_TO_CASHIER);
            queues.put("Cashier", cashier != null ? cashier.intValue() : 0);
            
            Long doctor = queueRepository.countByBranchAndDateAndStatus(branchId, today, ReceptionQueue.QueueStatus.SENT_TO_DOCTOR);
            queues.put("Doctor", doctor != null ? doctor.intValue() : 0);
        } catch (Exception e) {
            log.error("Error fetching queues for branch {}: {}", branchId, e.getMessage());
            queues.put("Reception", 0);
            queues.put("Cashier", 0);
            queues.put("Doctor", 0);
        }
        
        return queues;
    }

    @Override
    public List<Map<String, Object>> getStaff(Long branchId) {
        try {
            return userRepository.findActiveByBranchId(branchId).stream().map(u -> {
                Map<String, Object> map = new HashMap<>();
                map.put("name", u.getFirstName() + " " + u.getLastName());
                map.put("role", u.getRole() != null ? u.getRole().getRoleName() : "No Role");
                map.put("status", u.getIsActive() != null && u.getIsActive() ? "Active" : "Inactive");
                return map;
            }).collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error fetching staff for branch {}: {}", branchId, e.getMessage());
            return new ArrayList<>();
        }
    }

    @Override
    public List<Map<String, Object>> getDoctors(Long branchId) {
        try {
            return userRepository.findDoctorsByBranchId(branchId).stream().map(u -> {
                Map<String, Object> map = new HashMap<>();
                map.put("id", u.getId());
                map.put("name", u.getFirstName() + " " + u.getLastName());
                map.put("specialization", u.getSpecialization() != null ? u.getSpecialization() : "General");
                map.put("status", u.getAvailabilityStatus() != null ? u.getAvailabilityStatus().toString() : "OFFLINE");
                return map;
            }).collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error fetching doctors for branch {}: {}", branchId, e.getMessage());
            return new ArrayList<>();
        }
    }

    @Override
    public Map<String, Object> getReceptionOverview(Long branchId) {
        LocalDate today = LocalDate.now();
        Map<String, Object> overview = new HashMap<>();
        
        try {
            overview.put("registeredToday", entryRepository.findByBranchIdAndEntryTypeAndEntryTimeBetween(branchId, "NORMAL", today.atStartOfDay(), today.atTime(LocalTime.MAX)).size());
            overview.put("waitingVitals", queueRepository.countByBranchAndDateAndStatus(branchId, today, ReceptionQueue.QueueStatus.WAITING));
            overview.put("completedVitals", queueRepository.countByBranchAndDateAndStatus(branchId, today, ReceptionQueue.QueueStatus.VITALS_COMPLETED));
        } catch (Exception e) {
            log.error("Error fetching reception overview for branch {}: {}", branchId, e.getMessage());
            overview.put("registeredToday", 0);
            overview.put("waitingVitals", 0L);
            overview.put("completedVitals", 0L);
        }
        
        return overview;
    }

    @Override
    public Map<String, Object> getCashierOverview(Long branchId) {
        LocalDate today = LocalDate.now();
        Map<String, Object> overview = new HashMap<>();
        
        try {
            Long pendingPayments = queueRepository.countByBranchAndDateAndStatus(branchId, today, ReceptionQueue.QueueStatus.SENT_TO_CASHIER);
            overview.put("pendingPayments", pendingPayments != null ? pendingPayments : 0L);
            Integer completedPayments = paymentRepository.countByBranchAndDate(branchId, today);
            overview.put("completedPayments", completedPayments != null ? completedPayments : 0);
            Double revenue = paymentRepository.sumAmountByBranchAndDate(branchId, today);
            overview.put("todayRevenue", revenue != null ? revenue : 0.0);
        } catch (Exception e) {
            log.error("Error fetching cashier overview for branch {}: {}", branchId, e.getMessage());
            overview.put("pendingPayments", 0L);
            overview.put("completedPayments", 0);
            overview.put("todayRevenue", 0.0);
        }
        
        return overview;
    }

    @Override
    public Map<String, Object> getDoctorOverview(Long branchId) {
        LocalDate today = LocalDate.now();
        Map<String, Object> overview = new HashMap<>();
        try {
            Integer activeDoctors = userRepository.findAvailableDoctorsByBranchId(branchId).size();
            overview.put("activeDoctors", activeDoctors != null ? activeDoctors : 0);
            Long consultationsCompleted = consultationRepository.countByBranchIdAndConsultationDateBetween(branchId, today.atStartOfDay(), today.atTime(LocalTime.MAX));
            overview.put("consultationsCompleted", consultationsCompleted != null ? consultationsCompleted : 0L);
        } catch (Exception e) {
            log.error("Error fetching doctor overview for branch {}: {}", branchId, e.getMessage());
            overview.put("activeDoctors", 0);
            overview.put("consultationsCompleted", 0L);
        }
        return overview;
    }

    @Override
    public List<Map<String, Object>> getLabStatus(Long branchId) {
        return new ArrayList<>(); // TODO: Implement Lab module repository
    }

    @Override
    public List<Map<String, Object>> getPharmacyStatus(Long branchId) {
        return new ArrayList<>(); // TODO: Implement Pharmacy module repository
    }

    @Override
    public List<Map<String, Object>> getWardStatus(Long branchId) {
        return new ArrayList<>(); // TODO: Implement Ward module repository
    }

    @Override
    public Map<String, Object> getDailySummary(Long branchId) {
        Map<String, Object> summary = new HashMap<>();
        summary.put("date", LocalDate.now());
        summary.put("stats", getDashboard(branchId));
        return summary;
    }

    @Override
    public Map<String, Object> getFinancialReport(Long branchId) {
        LocalDate today = LocalDate.now();
        Map<String, Object> report = new HashMap<>();
        try {
            Double revenue = paymentRepository.sumAmountByBranchAndDate(branchId, today);
            report.put("totalRevenue", revenue != null ? revenue : 0.0);
        } catch (Exception e) {
            log.error("Error fetching financial report for branch {}: {}", branchId, e.getMessage());
            report.put("totalRevenue", 0.0);
        }
        return report;
    }
}
