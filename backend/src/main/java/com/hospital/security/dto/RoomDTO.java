package com.hospital.security.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class RoomDTO {
    private Long id;
    private String roomNumber;
    private String roomType;
    private int totalBeds;
    private int availableBeds;
    private List<BedDTO> beds;
}
