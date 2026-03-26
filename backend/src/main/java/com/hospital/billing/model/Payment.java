package com.hospital.billing.model;

import com.hospital.auth.model.User;
import com.hospital.multibranch.model.Branch;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "receipt_number", unique = true, nullable = false, length = 50)
    private String receiptNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_entry_id", nullable = true)
    private com.hospital.security.model.PatientEntry patientEntry;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    private Branch branch;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "processed_by", nullable = false)
    private User processedBy;

    @Column(name = "amount", nullable = false)
    private BigDecimal amount;

    @Column(name = "discount")
    @Builder.Default
    private BigDecimal discount = BigDecimal.ZERO;

    @Column(name = "service_type", length = 50)
    private String serviceType; // CONSULTATION, LAB, IMAGING, PHARMACY

    @Column(name = "payment_method", length = 50)
    private String paymentMethod; // CASH, MOBILE_MONEY, CARD

    @Column(name = "status", length = 50)
    @Builder.Default
    private String status = "COMPLETED"; // COMPLETED, CANCELLED, REFUNDED

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "payment_date")
    @Builder.Default
    private LocalDateTime paymentDate = LocalDateTime.now();

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.paymentDate == null) {
            this.paymentDate = LocalDateTime.now();
        }
    }
}
