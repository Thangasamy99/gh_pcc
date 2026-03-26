package com.hospital.security.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BedDTO {
    private Long id;
    private String bedNumber;
    private String status; // AVAILABLE, OCCUPIED, MAINTENANCE
    private Long currentPatientId;
    private String currentPatientName;
}
