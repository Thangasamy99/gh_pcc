package com.hospital.security.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SecurityDashboardDTO {
    private int totalEntriesToday;
    private int emergencyCasesToday;
    private int visitorsInside;
    private int normalEntriesToday;
    private int visitorEntriesToday;
    private int emergencyEntriesToday;
}
