package com.hospital.superadmin.dto.response;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
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
    private Integer userCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy; // Changed to match the ServiceImpl expectations for String response
    private String updatedBy;
}
