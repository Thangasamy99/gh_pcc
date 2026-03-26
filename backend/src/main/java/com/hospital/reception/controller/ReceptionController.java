package com.hospital.reception.controller;

import com.hospital.reception.dto.PatientVitalsDTO;
import com.hospital.reception.dto.ReceptionDashboardDTO;
import com.hospital.reception.dto.ReceptionQueueDTO;
import com.hospital.reception.model.ReceptionQueue;
import com.hospital.reception.service.ReceptionService;
import com.hospital.security.dto.PatientEntryResponseDTO;
import com.hospital.auth.model.User;
import com.hospital.auth.repository.UserRepository;
import com.hospital.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/reception")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Reception Management", description = "APIs for reception module")
@PreAuthorize("hasAuthority('RECEPTIONIST') or hasAuthority('SUPER_ADMIN')")
public class ReceptionController {

    private final ReceptionService receptionService;
    private final UserRepository userRepository;

    // Dashboard APIs
    @GetMapping("/dashboard")
    @Operation(summary = "Get reception dashboard data")
    public ResponseEntity<ApiResponse<ReceptionDashboardDTO>> getDashboard(Authentication authentication) {
        String username = authentication.getName();
        Long branchId = getBranchIdFromUsername(username);
        ReceptionDashboardDTO dashboard = receptionService.getDashboardData(branchId);
        return ResponseEntity.ok(ApiResponse.success(dashboard));
    }

    // Patient Entry APIs
    @GetMapping("/patients/pending")
    @Operation(summary = "Get pending patients from security")
    public ResponseEntity<ApiResponse<List<PatientEntryResponseDTO>>> getPendingPatients(Authentication authentication) {
        String username = authentication.getName();
        Long branchId = getBranchIdFromUsername(username);
        List<PatientEntryResponseDTO> patients = receptionService.getPendingPatients(branchId);
        return ResponseEntity.ok(ApiResponse.success(patients));
    }

    @GetMapping("/patients/{patientEntryId}")
    @Operation(summary = "Get patient entry by ID")
    public ResponseEntity<ApiResponse<PatientEntryResponseDTO>> getPatientEntry(@PathVariable Long patientEntryId) {
        PatientEntryResponseDTO patient = receptionService.getPatientEntryById(patientEntryId);
        return ResponseEntity.ok(ApiResponse.success(patient));
    }

    @PostMapping("/queue/add")
    @Operation(summary = "Add patient to reception queue")
    public ResponseEntity<ApiResponse<ReceptionQueueDTO>> addToQueue(@RequestParam Long patientEntryId, Authentication authentication) {
        String username = authentication.getName();
        Long branchId = getBranchIdFromUsername(username);
        ReceptionQueueDTO queue = receptionService.addPatientToQueue(patientEntryId, branchId, username);
        return ResponseEntity.ok(ApiResponse.success("Patient added to queue", queue));
    }

    // Vitals APIs
    @PostMapping("/vitals")
    @Operation(summary = "Record patient vitals")
    public ResponseEntity<ApiResponse<PatientVitalsDTO>> recordVitals(@RequestBody PatientVitalsDTO vitalsDTO, Authentication authentication) {
        String username = authentication.getName();
        Long branchId = getBranchIdFromUsername(username);
        PatientVitalsDTO vitals = receptionService.recordVitals(vitalsDTO, branchId, username);
        return ResponseEntity.ok(ApiResponse.success("Vitals recorded successfully", vitals));
    }

    @GetMapping("/vitals/{patientEntryId}")
    @Operation(summary = "Get patient vitals")
    public ResponseEntity<ApiResponse<PatientVitalsDTO>> getPatientVitals(@PathVariable Long patientEntryId) {
        PatientVitalsDTO vitals = receptionService.getPatientVitals(patientEntryId);
        return ResponseEntity.ok(ApiResponse.success(vitals));
    }

    @GetMapping("/vitals")
    @Operation(summary = "Get today's recorded vitals")
    public ResponseEntity<ApiResponse<List<PatientVitalsDTO>>> getTodayVitals(Authentication authentication) {
        String username = authentication.getName();
        Long branchId = getBranchIdFromUsername(username);
        List<PatientVitalsDTO> vitals = receptionService.getTodayVitals(branchId);
        return ResponseEntity.ok(ApiResponse.success(vitals));
    }

    // Queue Management APIs
    @GetMapping("/queue/waiting")
    @Operation(summary = "Get waiting queue")
    public ResponseEntity<ApiResponse<List<ReceptionQueueDTO>>> getWaitingQueue(Authentication authentication) {
        String username = authentication.getName();
        Long branchId = getBranchIdFromUsername(username);
        List<ReceptionQueueDTO> queue = receptionService.getWaitingQueue(branchId);
        return ResponseEntity.ok(ApiResponse.success(queue));
    }

    @PostMapping("/queue/send-to-cashier")
    @Operation(summary = "Send patient to cashier")
    public ResponseEntity<ApiResponse<ReceptionQueueDTO>> sendToCashier(@RequestParam Long patientEntryId, Authentication authentication) {
        String username = authentication.getName();
        Long branchId = getBranchIdFromUsername(username);
        ReceptionQueueDTO queue = receptionService.sendToCashier(patientEntryId, branchId, username);
        return ResponseEntity.ok(ApiResponse.success("Patient sent to cashier", queue));
    }

    @PostMapping("/queue/assign-room")
    @Operation(summary = "Assign consultation room and doctor")
    public ResponseEntity<ApiResponse<ReceptionQueueDTO>> assignConsultationRoom(
            @RequestParam Long patientEntryId,
            @RequestParam String consultationRoom,
            @RequestParam(required = false) Long doctorId,
            Authentication authentication) {
        String username = authentication.getName();
        Long branchId = getBranchIdFromUsername(username);
        ReceptionQueueDTO queue = receptionService.assignConsultationRoomWithDoctor(patientEntryId, consultationRoom, doctorId, branchId, username);
        return ResponseEntity.ok(ApiResponse.success("Room and Doctor assigned successfully", queue));
    }

    @PostMapping("/queue/send-to-doctor")
    @Operation(summary = "Send patient to doctor")
    public ResponseEntity<ApiResponse<ReceptionQueueDTO>> sendToDoctor(@RequestParam Long patientEntryId, Authentication authentication) {
        String username = authentication.getName();
        Long branchId = getBranchIdFromUsername(username);
        ReceptionQueueDTO queue = receptionService.sendToDoctor(patientEntryId, branchId, username);
        return ResponseEntity.ok(ApiResponse.success("Patient sent to doctor", queue));
    }

    @GetMapping("/queue/today")
    @Operation(summary = "Get today's queue")
    public ResponseEntity<ApiResponse<List<ReceptionQueueDTO>>> getTodayQueue(Authentication authentication) {
        String username = authentication.getName();
        Long branchId = getBranchIdFromUsername(username);
        List<ReceptionQueueDTO> queue = receptionService.getTodayQueue(branchId);
        return ResponseEntity.ok(ApiResponse.success(queue));
    }

    // Patient List APIs
    @GetMapping("/patients/today")
    @Operation(summary = "Get today's patients")
    public ResponseEntity<ApiResponse<List<PatientEntryResponseDTO>>> getTodayPatients(Authentication authentication) {
        String username = authentication.getName();
        Long branchId = getBranchIdFromUsername(username);
        List<PatientEntryResponseDTO> patients = receptionService.getTodayPatients(branchId);
        return ResponseEntity.ok(ApiResponse.success(patients));
    }

    @GetMapping("/patients/status/{status}")
    @Operation(summary = "Get patients by queue status")
    public ResponseEntity<ApiResponse<List<ReceptionQueueDTO>>> getPatientsByStatus(@PathVariable ReceptionQueue.QueueStatus status, Authentication authentication) {
        String username = authentication.getName();
        Long branchId = getBranchIdFromUsername(username);
        List<ReceptionQueueDTO> patients = receptionService.getPatientsByStatus(status, branchId);
        return ResponseEntity.ok(ApiResponse.success(patients));
    }

    // Helper method to get branch ID from username
    private Long getBranchIdFromUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
        return user.getPrimaryBranch() != null ? user.getPrimaryBranch().getId() : 1L;
    }
}
