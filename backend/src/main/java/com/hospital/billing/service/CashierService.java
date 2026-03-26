package com.hospital.billing.service;

import com.hospital.auth.model.User;
import com.hospital.auth.repository.UserRepository;
import com.hospital.billing.dto.CashierDTOs.*;
import com.hospital.billing.model.Payment;
import com.hospital.billing.repository.PaymentRepository;
import com.hospital.multibranch.model.Branch;
import com.hospital.multibranch.repository.BranchRepository;
import com.hospital.reception.model.ReceptionQueue;
import com.hospital.reception.repository.ReceptionQueueRepository;
import com.hospital.security.model.PatientEntry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CashierService {

    private final PaymentRepository paymentRepository;
    private final ReceptionQueueRepository receptionQueueRepository;
    private final BranchRepository branchRepository;
    private final UserRepository userRepository;
    private final com.hospital.common.service.SequenceGeneratorService sequenceGenerator;
    private final com.hospital.security.repository.PatientEntryRepository patientEntryRepository;

    @Transactional(readOnly = true)
    public CashierDashboardDTO getDashboard(Long branchId) {
        LocalDate today = LocalDate.now();
        List<Payment> dailyPayments = paymentRepository.findByBranchIdAndDateOrderByPaymentDateDesc(branchId, today);
        
        Double totalRevenue = dailyPayments.stream().mapToDouble(p -> p.getAmount().doubleValue()).sum();
        Double totalInsurance = dailyPayments.stream()
                .filter(p -> p.getServiceType() != null && p.getServiceType().contains("INSURANCE"))
                .mapToDouble(p -> p.getAmount().doubleValue())
                .sum();
        
        List<ReceptionQueue> pending = receptionQueueRepository.findByBranchIdAndQueueStatusOrderByQueueNumberAsc(branchId, ReceptionQueue.QueueStatus.SENT_TO_CASHIER);
        
        int fastTrackCount = (int) pending.stream()
                .filter(q -> Boolean.TRUE.equals(q.getPatientEntry().getIsEmergency()))
                .count();

        return CashierDashboardDTO.builder()
                .totalRevenue(BigDecimal.valueOf(totalRevenue))
                .totalInsurancePayments(BigDecimal.valueOf(totalInsurance))
                .totalPaymentsToday(dailyPayments.size())
                .pendingPayments(pending.size())
                .fastTrackPatients(fastTrackCount)
                .build();
    }

     @Transactional(readOnly = true)
    public List<PendingPaymentDTO> getPendingConsultations(Long branchId) {
        log.info("Fetching pending consultations for branch: {}", branchId);
        try {
            List<ReceptionQueue> queue = receptionQueueRepository.findByBranchIdAndQueueStatusOrderByQueueNumberAsc(branchId, ReceptionQueue.QueueStatus.SENT_TO_CASHIER);
            log.info("Found {} pending consultations", queue.size());
            return queue.stream()
                    .map(this::mapToPendingPayment)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error in getPendingConsultations: {}", e.getMessage(), e);
            throw e;
        }
    }

     private PendingPaymentDTO mapToPendingPayment(ReceptionQueue queue) {
        try {
            PatientEntry entry = queue.getPatientEntry();
            log.info("Mapping queue entry #{} for patient: {}", queue.getQueueNumber(), entry != null ? entry.getPatientName() : "NULL");
            
            if (entry == null) {
                log.warn("Queue entry #{} has NULL patientEntry!", queue.getId());
                return null;
            }

            return PendingPaymentDTO.builder()
                    .patientEntryId(entry.getId())
                    .patientName(entry.getPatientName())
                    .patientId(entry.getEntryId())
                    .patientType(Boolean.TRUE.equals(entry.getIsEmergency()) ? "FASTTRACK" : "NORMAL")
                    .service(queue.getNotes() != null && queue.getNotes().contains("Service:") ? queue.getNotes() : "CONSULTATION")
                    .amount(BigDecimal.ZERO)
                    .status("PENDING")
                    .queueTime(queue.getQueueTime())
                    .build();
        } catch (Exception e) {
            log.error("Error mapping queue entry: {}", e.getMessage(), e);
            throw e;
        }
    }

    private PaymentReceiptDTO createPayment(Long branchId, Long patientEntryId, String username, BigDecimal amount, BigDecimal discount, String method, String serviceType, String notes, boolean isConsultation) {
        User processedBy = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found: " + username));
        Branch branch = branchRepository.findById(branchId).orElseThrow(() -> new RuntimeException("Branch not found"));
        
        PatientEntry entry = null;
        if (patientEntryId != null) {
            ReceptionQueue queue = receptionQueueRepository.findByPatientEntryId(patientEntryId)
                    .orElseThrow(() -> new RuntimeException("Patient not in queue"));
            entry = queue.getPatientEntry();

            if (isConsultation) {
                if (queue.getQueueStatus() != ReceptionQueue.QueueStatus.SENT_TO_CASHIER) {
                    throw new RuntimeException("Patient is not waiting at Cashier");
                }
                
                // Automatically generate permanent Patient ID upon payment if it's a new entry
                if (entry.getEntryId().contains("-TEMP-")) {
                    String permanentId = sequenceGenerator.generatePatientId(branch.getBranchCode());
                    entry.setEntryId(permanentId);
                    patientEntryRepository.save(entry);
                }

                queue.setPaymentCompleted(true);
                queue.setQueueStatus(ReceptionQueue.QueueStatus.PAYMENT_COMPLETED);
                queue.setCashierTime(LocalDateTime.now());
                receptionQueueRepository.save(queue);
            }
        }

        Payment payment = Payment.builder()
                .receiptNumber(sequenceGenerator.generateReceiptId(branch.getBranchCode()))
                .patientEntry(entry)
                .branch(branch)
                .processedBy(processedBy)
                .amount(amount)
                .discount(discount != null ? discount : BigDecimal.ZERO)
                .serviceType(serviceType)
                .paymentMethod(method)
                .notes(notes)
                .status("COMPLETED")
                .paymentDate(LocalDateTime.now())
                .build();
                
        paymentRepository.save(payment);

        return PaymentReceiptDTO.builder()
                .receiptId(payment.getReceiptNumber())
                .patientName(entry != null ? entry.getPatientName() : "Walk-in/External")
                .service(serviceType)
                .amountPaid(amount)
                .paymentMethod(method)
                .date(payment.getPaymentDate())
                .status("PAID")
                .build();
    }

    @Transactional
    public PaymentReceiptDTO processConsultationPayment(ConsultationPaymentRequestDTO req, String username) {
        String service = "CONSULTATION - " + req.getPaymentType();
        return createPayment(req.getBranchId(), req.getPatientEntryId(), username, req.getAmount(), req.getDiscount(), req.getPaymentMethod(), service, req.getNotes(), true);
    }

    @Transactional
    public PaymentReceiptDTO processLabPayment(LabPaymentRequestDTO req, String username) {
        return createPayment(req.getBranchId(), req.getPatientEntryId(), username, req.getAmount(), BigDecimal.ZERO, req.getPaymentMethod(), "LAB - " + req.getTestType(), null, false);
    }

    @Transactional
    public PaymentReceiptDTO processImagingPayment(ImagingPaymentRequestDTO req, String username) {
        return createPayment(req.getBranchId(), req.getPatientEntryId(), username, req.getAmount(), BigDecimal.ZERO, req.getPaymentMethod(), "IMAGING - " + req.getScanType(), null, false);
    }

    @Transactional
    public PaymentReceiptDTO processPharmacyPayment(PharmacyPaymentRequestDTO req, String username) {
        return createPayment(req.getBranchId(), req.getPatientEntryId(), username, req.getAmount(), BigDecimal.ZERO, req.getPaymentMethod(), "PHARMACY - Meds", null, false);
    }

    @Transactional
    public PaymentReceiptDTO processAdmissionPayment(AdmissionPaymentRequestDTO req, String username) {
        return createPayment(req.getBranchId(), req.getPatientEntryId(), username, req.getAdvanceAmount(), BigDecimal.ZERO, req.getPaymentMethod(), "ADMISSION - " + req.getWardType(), "Advance", false);
    }

    @Transactional
    public PaymentReceiptDTO processInsurancePayment(InsurancePaymentRequestDTO req, String username) {
        String service = "INSURANCE - " + req.getInsuranceCompany() + " (" + req.getPolicyNumber() + ")";
        return createPayment(req.getBranchId(), req.getPatientEntryId(), username, req.getPaidAmount(), BigDecimal.ZERO, "INSURANCE", service, "Approved: " + req.getApprovedAmount(), false);
    }

    @Transactional
    public PaymentReceiptDTO processCreditPayment(CreditPaymentRequestDTO req, String username) {
        String service = "CREDIT_PAYMENT - Remaining: " + req.getRemainingBalance();
        return createPayment(req.getBranchId(), req.getPatientEntryId(), username, req.getPaidAmount(), BigDecimal.ZERO, req.getPaymentMethod(), service, "Total Bill: " + req.getTotalBill(), false);
    }

    @Transactional(readOnly = true)
    public List<PaymentReceiptDTO> getHistory(Long branchId) {
        return paymentRepository.findByBranchIdOrderByPaymentDateDesc(branchId).stream()
                .map(p -> PaymentReceiptDTO.builder()
                        .receiptId(p.getReceiptNumber())
                        .patientName(p.getPatientEntry() != null ? p.getPatientEntry().getPatientName() : "Unknown")
                        .service(p.getServiceType())
                        .amountPaid(p.getAmount())
                        .paymentMethod(p.getPaymentMethod())
                        .date(p.getPaymentDate())
                        .status(p.getStatus())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CollectionReportDTO getDailyReport(Long branchId) {
        LocalDate today = LocalDate.now();
        List<Payment> dailyPayments = paymentRepository.findByBranchIdAndDateOrderByPaymentDateDesc(branchId, today);

        Double totalRev = dailyPayments.stream().mapToDouble(p -> p.getAmount().doubleValue()).sum();
        Double discountTotal = dailyPayments.stream().mapToDouble(p -> p.getDiscount() != null ? p.getDiscount().doubleValue() : 0.0).sum();
        
        Double insuranceTotal = dailyPayments.stream().filter(p -> p.getServiceType() != null && p.getServiceType().contains("INSURANCE")).mapToDouble(p -> p.getAmount().doubleValue()).sum();
        Double creditTotal = dailyPayments.stream().filter(p -> p.getServiceType() != null && p.getServiceType().contains("CREDIT_PAYMENT")).mapToDouble(p -> p.getAmount().doubleValue()).sum();
        
        Double cashTotal = dailyPayments.stream().filter(p -> "CASH".equals(p.getPaymentMethod())).mapToDouble(p -> p.getAmount().doubleValue()).sum();
        Double mobileTotal = dailyPayments.stream().filter(p -> "MOBILE_MONEY".equals(p.getPaymentMethod())).mapToDouble(p -> p.getAmount().doubleValue()).sum();
        Double cardTotal = dailyPayments.stream().filter(p -> "CARD".equals(p.getPaymentMethod())).mapToDouble(p -> p.getAmount().doubleValue()).sum();

        return CollectionReportDTO.builder()
                .totalRevenue(BigDecimal.valueOf(totalRev))
                .insuranceTotal(BigDecimal.valueOf(insuranceTotal))
                .creditTotal(BigDecimal.valueOf(creditTotal))
                .discountTotal(BigDecimal.valueOf(discountTotal))
                .totalPatientsPaid(dailyPayments.size())
                .cashTotal(BigDecimal.valueOf(cashTotal))
                .mobileMoneyTotal(BigDecimal.valueOf(mobileTotal))
                .cardTotal(BigDecimal.valueOf(cardTotal))
                .build();
    }
}
