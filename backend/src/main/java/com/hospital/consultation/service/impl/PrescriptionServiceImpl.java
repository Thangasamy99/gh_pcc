package com.hospital.consultation.service.impl;

import com.hospital.auth.model.User;
import com.hospital.auth.repository.UserRepository;
import com.hospital.common.service.SequenceGeneratorService;
import com.hospital.consultation.dto.PrescriptionDTO;
import com.hospital.consultation.dto.CreatePrescriptionRequest;
import com.hospital.consultation.model.Consultation;
import com.hospital.consultation.model.Prescription;
import com.hospital.consultation.repository.ConsultationRepository;
import com.hospital.consultation.repository.PrescriptionRepository;
import com.hospital.consultation.service.api.PrescriptionService;
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
public class PrescriptionServiceImpl implements PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final ConsultationRepository consultationRepository;
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final BranchRepository branchRepository;
    private final SequenceGeneratorService sequenceGenerator;

    @Override
    @Transactional
    @SuppressWarnings("null")
    public PrescriptionDTO createPrescription(CreatePrescriptionRequest request) {
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        User doctor = userRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        Branch branch = branchRepository.findById(request.getBranchId())
                .orElseThrow(() -> new RuntimeException("Branch not found"));
        
        Consultation consultation = null;
        if (request.getConsultationId() != null) {
            consultation = consultationRepository.findById(request.getConsultationId())
                    .orElseThrow(() -> new RuntimeException("Consultation not found"));
        }

        String prescriptionSmartId = sequenceGenerator.generatePrescriptionId(branch.getBranchCode());

        Prescription prescription = Prescription.builder()
                .prescriptionId(prescriptionSmartId)
                .patient(patient)
                .doctor(doctor)
                .branch(branch)
                .consultation(consultation)
                .notes(request.getNotes())
                .status("PENDING")
                .build();

        Prescription savedPrescription = prescriptionRepository.save(prescription);
        return mapToDTO(savedPrescription);
    }

    @Override
    @Transactional(readOnly = true)
    @SuppressWarnings("null")
    public PrescriptionDTO getPrescriptionById(Long id) {
        return prescriptionRepository.findById(id)
                .map(this::mapToDTO)
                .orElseThrow(() -> new RuntimeException("Prescription not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public PrescriptionDTO getPrescriptionBySmartId(String prescriptionId) {
        return prescriptionRepository.findByPrescriptionId(prescriptionId)
                .map(this::mapToDTO)
                .orElseThrow(() -> new RuntimeException("Prescription not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<PrescriptionDTO> getAllPrescriptions() {
        return prescriptionRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private PrescriptionDTO mapToDTO(Prescription prescription) {
        return PrescriptionDTO.builder()
                .id(prescription.getId())
                .prescriptionId(prescription.getPrescriptionId())
                .patientName(prescription.getPatient().getFirstName() + " " + prescription.getPatient().getLastName())
                .doctorName(prescription.getDoctor().getFirstName() + " " + prescription.getDoctor().getLastName())
                .branchName(prescription.getBranch().getBranchName())
                .issueDate(prescription.getIssueDate())
                .status(prescription.getStatus())
                .notes(prescription.getNotes())
                .build();
    }
}
