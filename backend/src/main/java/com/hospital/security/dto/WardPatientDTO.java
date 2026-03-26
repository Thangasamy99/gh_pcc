package com.hospital.security.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WardPatientDTO {
    private String patientName;
    private String wardName;
    private String roomNumber;
    private String bedNumber;
    private String status;
}
