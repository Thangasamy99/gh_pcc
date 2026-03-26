package com.hospital.billing.dto;

import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateInvoiceRequest {
    private Long patientId;
    private Long branchId;
    private Long createdByUserId;
    private BigDecimal totalAmount;
}
