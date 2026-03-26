package com.hospital.consultation.service.impl;

import com.hospital.auth.model.User;
import com.hospital.auth.repository.UserRepository;
import com.hospital.common.service.SequenceGeneratorService;
import com.hospital.consultation.dto.ConsultationDTO;
import com.hospital.consultation.dto.CreateConsultationRequest;
import com.hospital.consultation.model.Consultation;
import com.hospital.consultation.repository.ConsultationRepository;
import com.hospital.consultation.service.api.ConsultationService;
import com.hospital.multibranch.model.Branch;
import com.hospital.multibranch.repository.BranchRepository;
import com.hospital.patient.model.Patient;
import com.hospital.patient.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ConsultationServiceImpl implements ConsultationService {

    private final ConsultationRepository consultationRepository;
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final BranchRepository branchRepository;
    private final SequenceGeneratorService sequenceGenerator;

    @Override
    @Transactional
    @SuppressWarnings("null")
    public ConsultationDTO createConsultation(CreateConsultationRequest request) {
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        User doctor = userRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        Branch branch = branchRepository.findById(request.getBranchId())
                .orElseThrow(() -> new RuntimeException("Branch not found"));

        String consultationSmartId = sequenceGenerator.generateConsultationId(branch.getBranchCode());

        Consultation consultation = Consultation.builder()
                .consultationId(consultationSmartId)
                .patient(patient)
                .doctor(doctor)
                .branch(branch)
                .symptoms(request.getSymptoms())
                .build();

        Consultation savedConsultation = consultationRepository.save(consultation);
        return mapToDTO(savedConsultation);
    }

    @Override
    @Transactional(readOnly = true)
    @SuppressWarnings("null")
    public ConsultationDTO getConsultationById(Long id) {
        return consultationRepository.findById(id)
                .map(this::mapToDTO)
                .orElseThrow(() -> new RuntimeException("Consultation not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public ConsultationDTO getConsultationBySmartId(String consultationId) {
        return consultationRepository.findByConsultationId(consultationId)
                .map(this::mapToDTO)
                .orElseThrow(() -> new RuntimeException("Consultation not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ConsultationDTO> getAllConsultations() {
        return consultationRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private ConsultationDTO mapToDTO(Consultation consultation) {
        return ConsultationDTO.builder()
                .id(consultation.getId())
                .consultationId(consultation.getConsultationId())
                .patientName(consultation.getPatient().getFirstName() + " " + consultation.getPatient().getLastName())
                .doctorName(consultation.getDoctor().getFirstName() + " " + consultation.getDoctor().getLastName())
                .branchName(consultation.getBranch().getBranchName())
                .consultationDate(consultation.getConsultationDate())
                .symptoms(consultation.getSymptoms())
                .clinicalNotes(consultation.getClinicalNotes())
                .build();
    }
}
