package com.hospital.ward.service.impl;

import com.hospital.auth.model.User;
import com.hospital.auth.repository.UserRepository;
import com.hospital.common.service.SequenceGeneratorService;
import com.hospital.multibranch.model.Branch;
import com.hospital.multibranch.repository.BranchRepository;
import com.hospital.patient.model.Patient;
import com.hospital.patient.repository.PatientRepository;
import com.hospital.ward.dto.AdmissionDTO;
import com.hospital.ward.dto.CreateAdmissionRequest;
import com.hospital.ward.model.Admission;
import com.hospital.ward.repository.AdmissionRepository;
import com.hospital.ward.service.api.AdmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdmissionServiceImpl implements AdmissionService {

    private final AdmissionRepository admissionRepository;
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final BranchRepository branchRepository;
    private final SequenceGeneratorService sequenceGenerator;

    @Override
    @Transactional
    @SuppressWarnings("null")
    public AdmissionDTO createAdmission(CreateAdmissionRequest request) {
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        User admittedBy = userRepository.findById(request.getAdmittedByUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Branch branch = branchRepository.findById(request.getBranchId())
                .orElseThrow(() -> new RuntimeException("Branch not found"));

        String admissionSmartId = sequenceGenerator.generateAdmissionId(branch.getBranchCode());

        Admission admission = Admission.builder()
                .admissionId(admissionSmartId)
                .patient(patient)
                .branch(branch)
                .admittedBy(admittedBy)
                .reasonForAdmission(request.getReason())
                .status("ADMITTED")
                .build();

        Admission savedAdmission = admissionRepository.save(admission);
        return mapToDTO(savedAdmission);
    }

    @Override
    @Transactional(readOnly = true)
    @SuppressWarnings("null")
    public AdmissionDTO getAdmissionById(Long id) {
        return admissionRepository.findById(id)
                .map(this::mapToDTO)
                .orElseThrow(() -> new RuntimeException("Admission not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public AdmissionDTO getAdmissionBySmartId(String admissionId) {
        return admissionRepository.findByAdmissionId(admissionId)
                .map(this::mapToDTO)
                .orElseThrow(() -> new RuntimeException("Admission not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<AdmissionDTO> getAllAdmissions() {
        return admissionRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private AdmissionDTO mapToDTO(Admission admission) {
        return AdmissionDTO.builder()
                .id(admission.getId())
                .admissionId(admission.getAdmissionId())
                .patientName(admission.getPatient().getFirstName() + " " + admission.getPatient().getLastName())
                .branchName(admission.getBranch().getBranchName())
                .admittedBy(admission.getAdmittedBy().getFirstName() + " " + admission.getAdmittedBy().getLastName())
                .admissionDate(admission.getAdmissionDate())
                .status(admission.getStatus())
                .build();
    }
}
