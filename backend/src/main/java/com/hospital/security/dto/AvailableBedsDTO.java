package com.hospital.security.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AvailableBedsDTO {
    private int totalBeds;
    private int occupiedBeds;
    private int availableBeds;
}
