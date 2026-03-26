package com.hospital.billing.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class CashierDTOs {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CashierDashboardDTO {
        private BigDecimal totalRevenue;
        private BigDecimal totalInsurancePayments;
        private Integer totalPaymentsToday;
        private Integer pendingPayments;
        private Integer fastTrackPatients;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PendingPaymentDTO {
        private Long patientEntryId;
        private String patientName;
        private String patientId; 
        private String patientType; 
        private String service; 
        private BigDecimal amount;
        private String status; 
        private LocalDateTime queueTime;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ConsultationPaymentRequestDTO {
        private Long patientEntryId;
        private BigDecimal amount;
        private String paymentMethod; // CASH, MOBILE_MONEY, CARD
        private String paymentType; // FULL_PAYMENT, ADVANCE_PAYMENT
        private BigDecimal discount;
        private String notes;
        private Long branchId;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LabPaymentRequestDTO {
        private Long patientEntryId;
        private String testType;
        private BigDecimal amount;
        private String paymentMethod;
        private Long branchId;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ImagingPaymentRequestDTO {
        private Long patientEntryId;
        private String scanType;
        private BigDecimal amount;
        private String paymentMethod;
        private Long branchId;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PharmacyPaymentRequestDTO {
        private Long patientEntryId;
        private BigDecimal medicineCost;
        private BigDecimal amount;
        private String paymentMethod;
        private Long branchId;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AdmissionPaymentRequestDTO {
        private Long patientEntryId;
        private String wardType;
        private BigDecimal advanceAmount;
        private String paymentMethod;
        private Long branchId;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InsurancePaymentRequestDTO {
        private Long patientEntryId;
        private String insuranceCompany;
        private String policyNumber;
        private BigDecimal approvedAmount;
        private BigDecimal paidAmount;
        private Long branchId;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreditPaymentRequestDTO {
        private Long patientEntryId;
        private BigDecimal totalBill;
        private BigDecimal paidAmount;
        private BigDecimal remainingBalance;
        private String paymentMethod;
        private Long branchId;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaymentReceiptDTO {
        private String receiptId;
        private String patientName;
        private String service;
        private BigDecimal amountPaid;
        private String paymentMethod;
        private LocalDateTime date;
        private String status;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CollectionReportDTO {
        private BigDecimal totalRevenue;
        private BigDecimal insuranceTotal;
        private BigDecimal creditTotal;
        private BigDecimal discountTotal;
        private Integer totalPatientsPaid;
        private BigDecimal cashTotal;
        private BigDecimal mobileMoneyTotal;
        private BigDecimal cardTotal;
    }
}
