package com.hospital.security.controller;

import com.hospital.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/v1/security/metadata")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Security Metadata", description = "Security Guard Metadata APIs")
public class SecurityMetadataController {

    @GetMapping("/visit-types")
    @Operation(summary = "Get all visit types for dropdown")
    public ResponseEntity<ApiResponse<List<Map<String, String>>>> getVisitTypes() {
        log.info("Fetching visit types");
        
        List<Map<String, String>> visitTypes = Arrays.asList(
            Map.of("value", "OUTPATIENT", "label", "Outpatient Consultation"),
            Map.of("value", "EMERGENCY", "label", "Emergency"),
            Map.of("value", "LABORATORY", "label", "Laboratory"),
            Map.of("value", "PHARMACY", "label", "Pharmacy"),
            Map.of("value", "MATERNITY", "label", "Maternity"),
            Map.of("value", "IMAGING", "label", "Imaging"),
            Map.of("value", "INPATIENT_VISIT", "label", "Visit Admitted Patient"),
            Map.of("value", "OTHER", "label", "Other")
        );
        
        return ResponseEntity.ok(ApiResponse.success(visitTypes));
    }

    @GetMapping("/departments")
    @Operation(summary = "Get all departments for dropdown")
    public ResponseEntity<ApiResponse<List<Map<String, String>>>> getDepartments() {
        log.info("Fetching departments");
        
        List<Map<String, String>> departments = Arrays.asList(
            Map.of("value", "RECEPTION", "label", "Reception"),
            Map.of("value", "EMERGENCY", "label", "Emergency"),
            Map.of("value", "LABORATORY", "label", "Laboratory"),
            Map.of("value", "PHARMACY", "label", "Pharmacy"),
            Map.of("value", "MATERNITY", "label", "Maternity"),
            Map.of("value", "CONSULTATION", "label", "Consultation"),
            Map.of("value", "IMAGING", "label", "Imaging"),
            Map.of("value", "WARD", "label", "Ward"),
            Map.of("value", "THEATRE", "label", "Operation Theatre")
        );
        
        return ResponseEntity.ok(ApiResponse.success(departments));
    }

    @GetMapping("/genders")
    @Operation(summary = "Get genders for dropdown")
    public ResponseEntity<ApiResponse<List<Map<String, String>>>> getGenders() {
        List<Map<String, String>> genders = Arrays.asList(
            Map.of("value", "MALE", "label", "Male"),
            Map.of("value", "FEMALE", "label", "Female"),
            Map.of("value", "OTHER", "label", "Other")
        );
        
        return ResponseEntity.ok(ApiResponse.success(genders));
    }

    @GetMapping("/relationships")
    @Operation(summary = "Get relationships for dropdown")
    public ResponseEntity<ApiResponse<List<Map<String, String>>>> getRelationships() {
        List<Map<String, String>> relationships = Arrays.asList(
            Map.of("value", "FATHER", "label", "Father"),
            Map.of("value", "MOTHER", "label", "Mother"),
            Map.of("value", "BROTHER", "label", "Brother"),
            Map.of("value", "SISTER", "label", "Sister"),
            Map.of("value", "SON", "label", "Son"),
            Map.of("value", "DAUGHTER", "label", "Daughter"),
            Map.of("value", "HUSBAND", "label", "Husband"),
            Map.of("value", "WIFE", "label", "Wife"),
            Map.of("value", "FRIEND", "label", "Friend"),
            Map.of("value", "RELATIVE", "label", "Relative"),
            Map.of("value", "OTHER", "label", "Other")
        );
        
        return ResponseEntity.ok(ApiResponse.success(relationships));
    }

    @GetMapping("/emergency-types")
    @Operation(summary = "Get emergency types for dropdown")
    public ResponseEntity<ApiResponse<List<Map<String, String>>>> getEmergencyTypes() {
        List<Map<String, String>> emergencyTypes = Arrays.asList(
            Map.of("value", "ACCIDENT", "label", "Accident"),
            Map.of("value", "CARDIAC", "label", "Cardiac Arrest"),
            Map.of("value", "RESPIRATORY", "label", "Respiratory Distress"),
            Map.of("value", "STROKE", "label", "Stroke"),
            Map.of("value", "SEIZURE", "label", "Seizure"),
            Map.of("value", "MATERNITY", "label", "Maternity Emergency"),
            Map.of("value", "TRAUMA", "label", "Trauma"),
            Map.of("value", "POISONING", "label", "Poisoning"),
            Map.of("value", "BURN", "label", "Burn"),
            Map.of("value", "OTHER", "label", "Other")
        );
        
        return ResponseEntity.ok(ApiResponse.success(emergencyTypes));
    }
}
