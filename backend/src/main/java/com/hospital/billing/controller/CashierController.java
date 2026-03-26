package com.hospital.billing.controller;

import com.hospital.billing.dto.CashierDTOs.*;
import com.hospital.billing.service.CashierService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/v1/cashier")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class CashierController {

    private final CashierService cashierService;

    private String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }

    private <T> Map<String, Object> createResponse(T data) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", data);
        return response;
    }

    @GetMapping("/dashboard/{branchId}")
    @PreAuthorize("hasAnyAuthority('SUPER_ADMIN', 'BRANCH_ADMIN', 'CASHIER')")
    public ResponseEntity<?> getDashboard(@PathVariable Long branchId) {
        return ResponseEntity.ok(createResponse(cashierService.getDashboard(branchId)));
    }

    @GetMapping("/consultation/pending/{branchId}")
    @PreAuthorize("hasAnyAuthority('SUPER_ADMIN', 'BRANCH_ADMIN', 'CASHIER')")
    public ResponseEntity<?> getPendingConsultations(@PathVariable Long branchId) {
        return ResponseEntity.ok(createResponse(cashierService.getPendingConsultations(branchId)));
    }

    @PostMapping("/consultation/pay")
    @PreAuthorize("hasAnyAuthority('SUPER_ADMIN', 'BRANCH_ADMIN', 'CASHIER')")
    public ResponseEntity<?> processConsultationPayment(@RequestBody ConsultationPaymentRequestDTO request) {
        return ResponseEntity.ok(createResponse(cashierService.processConsultationPayment(request, getCurrentUsername())));
    }

    @PostMapping("/service/lab/pay")
    @PreAuthorize("hasAnyAuthority('SUPER_ADMIN', 'BRANCH_ADMIN', 'CASHIER')")
    public ResponseEntity<?> processLabPayment(@RequestBody LabPaymentRequestDTO request) {
        return ResponseEntity.ok(createResponse(cashierService.processLabPayment(request, getCurrentUsername())));
    }

    @PostMapping("/service/imaging/pay")
    @PreAuthorize("hasAnyAuthority('SUPER_ADMIN', 'BRANCH_ADMIN', 'CASHIER')")
    public ResponseEntity<?> processImagingPayment(@RequestBody ImagingPaymentRequestDTO request) {
        return ResponseEntity.ok(createResponse(cashierService.processImagingPayment(request, getCurrentUsername())));
    }

    @PostMapping("/service/pharmacy/pay")
    @PreAuthorize("hasAnyAuthority('SUPER_ADMIN', 'BRANCH_ADMIN', 'CASHIER')")
    public ResponseEntity<?> processPharmacyPayment(@RequestBody PharmacyPaymentRequestDTO request) {
        return ResponseEntity.ok(createResponse(cashierService.processPharmacyPayment(request, getCurrentUsername())));
    }

    @PostMapping("/service/admission/pay")
    @PreAuthorize("hasAnyAuthority('SUPER_ADMIN', 'BRANCH_ADMIN', 'CASHIER')")
    public ResponseEntity<?> processAdmissionPayment(@RequestBody AdmissionPaymentRequestDTO request) {
        return ResponseEntity.ok(createResponse(cashierService.processAdmissionPayment(request, getCurrentUsername())));
    }

    @PostMapping("/insurance/pay")
    @PreAuthorize("hasAnyAuthority('SUPER_ADMIN', 'BRANCH_ADMIN', 'CASHIER')")
    public ResponseEntity<?> processInsurancePayment(@RequestBody InsurancePaymentRequestDTO request) {
        return ResponseEntity.ok(createResponse(cashierService.processInsurancePayment(request, getCurrentUsername())));
    }

    @PostMapping("/credit/pay")
    @PreAuthorize("hasAnyAuthority('SUPER_ADMIN', 'BRANCH_ADMIN', 'CASHIER')")
    public ResponseEntity<?> processCreditPayment(@RequestBody CreditPaymentRequestDTO request) {
        return ResponseEntity.ok(createResponse(cashierService.processCreditPayment(request, getCurrentUsername())));
    }

    @GetMapping("/history/{branchId}")
    @PreAuthorize("hasAnyAuthority('SUPER_ADMIN', 'BRANCH_ADMIN', 'CASHIER')")
    public ResponseEntity<?> getPaymentHistory(@PathVariable Long branchId) {
        return ResponseEntity.ok(createResponse(cashierService.getHistory(branchId)));
    }

    @GetMapping("/reports/daily/{branchId}")
    @PreAuthorize("hasAnyAuthority('SUPER_ADMIN', 'BRANCH_ADMIN', 'CASHIER')")
    public ResponseEntity<?> getDailyReport(@PathVariable Long branchId) {
        return ResponseEntity.ok(createResponse(cashierService.getDailyReport(branchId)));
    }
}
