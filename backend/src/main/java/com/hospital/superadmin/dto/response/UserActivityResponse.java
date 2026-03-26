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
public class UserActivityResponse {
    private Integer activeNow;
    private Integer todayActive;
    private Integer weekActive;
    private Integer monthActive;
    private List<UserTrend> trends;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UserTrend {
        private String time;
        private Integer count;
    }
}
