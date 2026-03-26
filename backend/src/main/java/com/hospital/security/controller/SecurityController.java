package com.hospital.security.controller;

import com.hospital.security.dto.*;
import com.hospital.security.service.SecurityService;
import com.hospital.common.dto.ApiResponse;
import com.hospital.common.exception.BusinessException;
import com.hospital.common.exception.ResourceNotFoundException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/v1/security")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Security Guard", description = "Security Guard Management APIs")
@PreAuthorize("hasAuthority('SECURITY') or hasAuthority('SUPER_ADMIN')")
public class SecurityController {

    private final SecurityService securityService;

    // ========== DASHBOARD ==========
    @GetMapping("/dashboard/{branchId}")
    @Operation(summary = "Get dashboard statistics")
    public ResponseEntity<ApiResponse<SecurityDashboardDTO>> getDashboardStats(@PathVariable Long branchId) {
        log.info("Fetching dashboard stats for branch: {}", branchId);
        try {
            SecurityDashboardDTO stats = securityService.getDashboardStats(branchId);
            return ResponseEntity.ok(ApiResponse.success(stats));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Error fetching dashboard stats: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(ApiResponse.error("Failed to fetch dashboard statistics"));
        }
    }

    // ========== DYNAMIC ENTRY ==========
    @PostMapping("/entries")
    @Operation(summary = "Create dynamic entry")
    public ResponseEntity<ApiResponse<EntryResponseDTO>> createEntry(
            @Valid @RequestBody DynamicEntryRequestDTO request,
            @RequestHeader("X-User-Id") Long userId) {
        log.info("Creating new entry of type: {}", request.getEntryType());
        try {
            EntryResponseDTO response = securityService.createEntry(request, userId);
            return ResponseEntity.ok(ApiResponse.success("Entry created successfully", response));
        } catch (BusinessException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Error creating entry: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(ApiResponse.error("Failed to create entry"));
        }
    }

    @GetMapping("/entries/today/{branchId}")
    @Operation(summary = "Get today's entries for a branch")
    public ResponseEntity<ApiResponse<List<EntryResponseDTO>>> getTodayEntries(
            @PathVariable Long branchId) {
        log.info("Fetching today's entries for branch: {}", branchId);
        try {
            List<EntryResponseDTO> entries = securityService.getTodayEntries(branchId);
            return ResponseEntity.ok(ApiResponse.success(entries));
        } catch (Exception e) {
            log.error("Error fetching today's entries: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(ApiResponse.error("Failed to fetch today's entries"));
        }
    }

    @GetMapping("/entries/patients/{branchId}")
    @Operation(summary = "Get all patient entries for a branch")
    public ResponseEntity<ApiResponse<List<EntryResponseDTO>>> getAllPatientEntries(
            @PathVariable Long branchId) {
        log.info("Fetching all patient entries for branch: {}", branchId);
        try {
            List<EntryResponseDTO> entries = securityService.getAllPatientEntries(branchId);
            return ResponseEntity.ok(ApiResponse.success(entries));
        } catch (Exception e) {
            log.error("Error fetching patient entries: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(ApiResponse.error("Failed to fetch patient entries"));
        }
    }

    @GetMapping("/entries/{id}")
    @Operation(summary = "Get entry by ID")
    public ResponseEntity<ApiResponse<EntryResponseDTO>> getEntryById(@PathVariable Long id) {
        log.info("Fetching entry by ID: {}", id);
        try {
            EntryResponseDTO entry = securityService.getEntryById(id);
            return ResponseEntity.ok(ApiResponse.success(entry));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Error fetching entry: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(ApiResponse.error("Failed to fetch entry"));
        }
    }

    @GetMapping("/visitors/active/{branchId}")
    @Operation(summary = "Get all active visitors for a branch")
    public ResponseEntity<ApiResponse<List<VisitorResponseDTO>>> getActiveVisitors(
            @PathVariable Long branchId) {
        List<VisitorResponseDTO> visitors = securityService.getActiveVisitors(branchId);
        return ResponseEntity.ok(ApiResponse.success(visitors));
    }

    @GetMapping("/visitors/daily/{branchId}")
    @Operation(summary = "Get daily visitors for a specific date")
    public ResponseEntity<ApiResponse<List<VisitorResponseDTO>>> getDailyVisitors(
            @PathVariable Long branchId,
            @RequestParam String date) {
        List<VisitorResponseDTO> visitors = securityService.getDailyVisitors(branchId, date);
        return ResponseEntity.ok(ApiResponse.success(visitors));
    }

    @GetMapping("/visitors/history/{branchId}")
    @Operation(summary = "Get visitor history")
    public ResponseEntity<ApiResponse<Page<VisitorResponseDTO>>> getVisitorHistory(
            @PathVariable Long branchId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) String patientName,
            @RequestParam(required = false) String visitorName,
            org.springframework.data.domain.Pageable pageable) {
        log.info("Fetching visitor history for branch: {}", branchId);
        try {
            Page<VisitorResponseDTO> visitors = securityService.getVisitorHistory(branchId, startDate, endDate, patientName, visitorName, pageable);
            return ResponseEntity.ok(ApiResponse.success(visitors));
        } catch (Exception e) {
            log.error("Error fetching visitor history: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(ApiResponse.error("Failed to fetch visitor history"));
        }
    }

    @PostMapping("/visitors/{id}/checkout")
    @Operation(summary = "Checkout visitor")
    public ResponseEntity<ApiResponse<VisitorResponseDTO>> checkoutVisitor(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId) {
        log.info("Checking out visitor: {}", id);
        try {
            VisitorResponseDTO response = securityService.checkoutVisitor(id, userId);
            return ResponseEntity.ok(ApiResponse.success("Visitor checked out successfully", response));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Error checking out visitor: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(ApiResponse.error("Failed to checkout visitor"));
        }
    }

    // ========== PATIENT LOCATION ==========
    @GetMapping("/patient/location")
    @Operation(summary = "Search patient location")
    public ResponseEntity<ApiResponse<PatientLocationDTO>> searchPatientLocation(
            @RequestParam String searchTerm) {
        log.info("Searching patient location: {}", searchTerm);
        try {
            PatientLocationDTO location = securityService.searchPatientLocation(searchTerm);
            return ResponseEntity.ok(ApiResponse.success(location));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Error searching patient location: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(ApiResponse.error("Failed to search patient location"));
        }
    }

    @GetMapping("/wards/{branchId}")
    @Operation(summary = "Get all wards")
    public ResponseEntity<ApiResponse<List<WardDTO>>> getAllWards(@PathVariable Long branchId) {
        log.info("Fetching wards for branch: {}", branchId);
        try {
            List<WardDTO> wards = securityService.getAllWards(branchId);
            return ResponseEntity.ok(ApiResponse.success(wards));
        } catch (Exception e) {
            log.error("Error fetching wards: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(ApiResponse.error("Failed to fetch wards"));
        }
    }

    @GetMapping("/wards/{wardId}/rooms")
    @Operation(summary = "Get rooms by ward")
    public ResponseEntity<ApiResponse<List<RoomDTO>>> getRoomsByWard(@PathVariable Long wardId) {
        log.info("Fetching rooms for ward: {}", wardId);
        try {
            List<RoomDTO> rooms = securityService.getRoomsByWard(wardId);
            return ResponseEntity.ok(ApiResponse.success(rooms));
        } catch (Exception e) {
            log.error("Error fetching rooms: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(ApiResponse.error("Failed to fetch rooms"));
        }
    }

    @GetMapping("/rooms/{roomId}/beds")
    @Operation(summary = "Get beds by room")
    public ResponseEntity<ApiResponse<List<BedDTO>>> getBedsByRoom(@PathVariable Long roomId) {
        log.info("Fetching beds for room: {}", roomId);
        try {
            List<BedDTO> beds = securityService.getBedsByRoom(roomId);
            return ResponseEntity.ok(ApiResponse.success(beds));
        } catch (Exception e) {
            log.error("Error fetching beds: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(ApiResponse.error("Failed to fetch beds"));
        }
    }

    // ========== LOGS & REPORTS ==========
    @GetMapping("/logs/daily/{branchId}")
    @Operation(summary = "Get daily logs")
    public ResponseEntity<ApiResponse<Page<EntryResponseDTO>>> getDailyLogs(
            @PathVariable Long branchId,
            @RequestParam String date,
            org.springframework.data.domain.Pageable pageable) {
        log.info("Fetching daily logs for branch: {}", branchId);
        try {
            Page<EntryResponseDTO> logs = securityService.getDailyLogs(branchId, LocalDate.parse(date), pageable);
            return ResponseEntity.ok(ApiResponse.success(logs));
        } catch (Exception e) {
            log.error("Error fetching daily logs: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(ApiResponse.error("Failed to fetch daily logs"));
        }
    }

    @GetMapping("/logs/emergency/{branchId}")
    @Operation(summary = "Get emergency logs")
    public ResponseEntity<ApiResponse<Page<EntryResponseDTO>>> getEmergencyLogs(
            @PathVariable Long branchId,
            @RequestParam String startDate,
            @RequestParam String endDate,
            org.springframework.data.domain.Pageable pageable) {
        log.info("Fetching emergency logs for branch: {}", branchId);
        try {
            Page<EntryResponseDTO> logs = securityService.getEmergencyLogs(branchId, LocalDate.parse(startDate), LocalDate.parse(endDate), pageable);
            return ResponseEntity.ok(ApiResponse.success(logs));
        } catch (Exception e) {
            log.error("Error fetching emergency logs: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(ApiResponse.error("Failed to fetch emergency logs"));
        }
    }
}
