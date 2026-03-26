package com.hospital.security.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BedResponseDTO {
    private Long id;
    private String bedNumber;
    private String status;
    private Long roomId;
    private Long wardId;
}
