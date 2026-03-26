package com.hospital.consultation.service.api;

import com.hospital.consultation.dto.PrescriptionDTO;
import com.hospital.consultation.dto.CreatePrescriptionRequest;
import java.util.List;

public interface PrescriptionService {
    PrescriptionDTO createPrescription(CreatePrescriptionRequest request);
    PrescriptionDTO getPrescriptionById(Long id);
    PrescriptionDTO getPrescriptionBySmartId(String prescriptionId);
    List<PrescriptionDTO> getAllPrescriptions();
}
