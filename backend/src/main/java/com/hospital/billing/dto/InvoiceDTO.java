package com.hospital.billing.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvoiceDTO {
    private Long id;
    private String invoiceId;
    private String patientName;
    private String branchName;
    private LocalDateTime invoiceDate;
    private BigDecimal totalAmount;
    private BigDecimal paidAmount;
    private String status;
}
