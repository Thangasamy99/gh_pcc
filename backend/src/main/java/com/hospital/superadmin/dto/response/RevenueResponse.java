package com.hospital.superadmin.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RevenueResponse {
    private Double totalRevenue;
    private Double growthPercentage;
    private List<RevenuePoint> trends;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RevenuePoint {
        private String period;
        private Double amount;
    }
}
