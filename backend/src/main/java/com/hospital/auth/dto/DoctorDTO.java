package com.hospital.auth.dto;

import com.hospital.auth.model.User.AvailabilityStatus;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorDTO {
    private Long id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String staffId;
    private String phone;
    private String gender;
    private String qualification;
    private Integer experienceYears;
    private String consultationRoom;
    private String specialization;
    private AvailabilityStatus availabilityStatus;
    private Long branchId;
    private String branchName;
    private String roleCode;
    private Boolean isActive;
    private LocalDateTime createdAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateRequest {
        private String username;
        private String email;
        private String password;
        private String firstName;
        private String lastName;
        private String phone;
        private String gender;
        private String qualification;
        private Integer experienceYears;
        private String consultationRoom;
        private String specialization;
        private String availabilityStatus; // AVAILABLE, BUSY, OFFLINE
        private Long branchId;
        private String roleCode; // DOCTOR, SURGEON, SPECIALIST
    }
}
