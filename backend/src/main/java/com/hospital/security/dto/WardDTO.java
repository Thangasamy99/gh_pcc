package com.hospital.security.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class WardDTO {
    private Long id;
    private String wardCode;
    private String wardName;
    private String wardType;
    private int totalBeds;
    private int availableBeds;
    private int occupiedBeds;
    private String floor;
    private List<RoomDTO> rooms;
}
