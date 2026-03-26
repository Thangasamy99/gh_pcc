package com.hospital.consultation.service.api;

import com.hospital.consultation.dto.ConsultationDTO;
import com.hospital.consultation.dto.CreateConsultationRequest;
import java.util.List;

public interface ConsultationService {
    ConsultationDTO createConsultation(CreateConsultationRequest request);
    ConsultationDTO getConsultationById(Long id);
    ConsultationDTO getConsultationBySmartId(String consultationId);
    List<ConsultationDTO> getAllConsultations();
}
