package com.hospital.security.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class WardResponseDTO {
    private Long id;
    private String wardCode;
    private String wardName;
    private String wardType;
    private Integer totalBeds;
    private Integer availableBeds;
    private Integer occupiedBeds;
    private String floor;
    private Long branchId;
}
