package com.hospital.multibranch.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BranchResponse {
    private Long id;
    private String branchCode;
    private String branchName;
    private String branchType;
    private String address;
    private String city;
    private String region;
    private String phone;
    private String email;
    private String registrationNumber;
    private String taxId;
    private LocalDate establishedDate;
    private Boolean isActive;
    private Boolean isDeleted;
    private LocalDateTime deletedAt;
    private Integer userCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
