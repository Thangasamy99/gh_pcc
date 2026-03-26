package com.hospital.ward.service.api;

import com.hospital.ward.dto.AdmissionDTO;
import com.hospital.ward.dto.CreateAdmissionRequest;
import java.util.List;

public interface AdmissionService {
    AdmissionDTO createAdmission(CreateAdmissionRequest request);
    AdmissionDTO getAdmissionById(Long id);
    AdmissionDTO getAdmissionBySmartId(String admissionId);
    List<AdmissionDTO> getAllAdmissions();
}
