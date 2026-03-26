package com.hospital.security.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RoomResponseDTO {
    private Long id;
    private String roomNumber;
    private String roomType;
    private Integer totalBeds;
    private Integer availableBeds;
    private Long wardId;
}
