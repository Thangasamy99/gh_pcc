package com.hospital.auth.controller;

import com.hospital.auth.dto.DoctorDTO;
import com.hospital.auth.service.api.DoctorService;
import com.hospital.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/doctor")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorService doctorService;

    @PostMapping("/create")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<DoctorDTO>> createDoctor(@RequestBody DoctorDTO.CreateRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Doctor created successfully", doctorService.createDoctor(request)));
    }

    @GetMapping("/list")
    public ResponseEntity<ApiResponse<List<DoctorDTO>>> getAllDoctors() {
        return ResponseEntity.ok(ApiResponse.success(doctorService.getAllDoctors()));
    }

    @GetMapping("/available/{branchId}")
    public ResponseEntity<ApiResponse<List<DoctorDTO>>> getAvailableDoctors(@PathVariable Long branchId) {
        return ResponseEntity.ok(ApiResponse.success(doctorService.getAvailableDoctorsByBranch(branchId)));
    }

    @GetMapping("/available/room/{consultationRoom}")
    public ResponseEntity<ApiResponse<List<DoctorDTO>>> getAvailableDoctorsByRoom(@PathVariable String consultationRoom) {
        return ResponseEntity.ok(ApiResponse.success(doctorService.getAvailableDoctorsByRoom(consultationRoom)));
    }

    @PatchMapping("/{doctorId}/availability")
    public ResponseEntity<ApiResponse<DoctorDTO>> updateAvailability(@PathVariable Long doctorId, @RequestParam String status) {
        return ResponseEntity.ok(ApiResponse.success("Availability updated", doctorService.updateAvailability(doctorId, status)));
    }
}
