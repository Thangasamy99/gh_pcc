package com.hospital.security.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PatientLocationDTO {
    private Long patientId;
    private String patientName;
    private String gender;
    private Integer age;
    private Long wardId;
    private String wardName;
    private String roomNumber;
    private String bedNumber;
    private String doctorName;
    private String admissionDate;
    private String status; // ADMITTED, DISCHARGED, etc.
}
