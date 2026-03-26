package com.hospital.patient.service.api;

import com.hospital.patient.dto.PatientDTO;
import com.hospital.patient.dto.PatientRegistrationDTO;
import java.util.List;

public interface PatientService {
    PatientDTO registerPatient(PatientRegistrationDTO registrationDTO);
    PatientDTO getPatientById(Long id);
    PatientDTO getPatientBySmartId(String patientId);
    List<PatientDTO> getAllPatients();
}
