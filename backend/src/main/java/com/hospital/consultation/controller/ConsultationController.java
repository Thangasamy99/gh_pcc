package com.hospital.consultation.controller;

import com.hospital.consultation.dto.CreateConsultationRequest;
import com.hospital.consultation.service.api.ConsultationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/v1/consultations")
@RequiredArgsConstructor
public class ConsultationController {

    private final ConsultationService consultationService;

    private <T> Map<String, Object> createResponse(T data) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", data);
        return response;
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('SUPER_ADMIN', 'BRANCH_ADMIN', 'DOCTOR', 'SURGEON', 'SPECIALIST')")
    public ResponseEntity<?> createConsultation(@RequestBody CreateConsultationRequest request) {
        return ResponseEntity.ok(createResponse(consultationService.createConsultation(request)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('SUPER_ADMIN', 'BRANCH_ADMIN', 'DOCTOR', 'SURGEON', 'SPECIALIST')")
    public ResponseEntity<?> getConsultation(@PathVariable Long id) {
        return ResponseEntity.ok(createResponse(consultationService.getConsultationById(id)));
    }

    @GetMapping("/smart/{smartId}")
    @PreAuthorize("hasAnyAuthority('SUPER_ADMIN', 'BRANCH_ADMIN', 'DOCTOR', 'SURGEON', 'SPECIALIST')")
    public ResponseEntity<?> getConsultationBySmartId(@PathVariable String smartId) {
        return ResponseEntity.ok(createResponse(consultationService.getConsultationBySmartId(smartId)));
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('SUPER_ADMIN', 'BRANCH_ADMIN', 'DOCTOR', 'SURGEON', 'SPECIALIST')")
    public ResponseEntity<?> getAllConsultations() {
        return ResponseEntity.ok(createResponse(consultationService.getAllConsultations()));
    }
}
