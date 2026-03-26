package com.hospital.patient.service.impl;

import com.hospital.auth.model.User;
import com.hospital.auth.repository.UserRepository;
import com.hospital.common.service.SequenceGeneratorService;
import com.hospital.multibranch.model.Branch;
import com.hospital.multibranch.repository.BranchRepository;
import com.hospital.patient.dto.PatientDTO;
import com.hospital.patient.dto.PatientRegistrationDTO;
import com.hospital.patient.model.Patient;
import com.hospital.patient.repository.PatientRepository;
import com.hospital.patient.service.api.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PatientServiceImpl implements PatientService {

    private final PatientRepository patientRepository;
    private final BranchRepository branchRepository;
    private final UserRepository userRepository; // Added UserRepository
    private final SequenceGeneratorService sequenceGenerator;

    @Override
    @Transactional
    @SuppressWarnings("null")
    public PatientDTO registerPatient(PatientRegistrationDTO registrationDTO) {
        Branch branch = branchRepository.findById(registrationDTO.getPrimaryBranchId())
                .orElseThrow(() -> new RuntimeException("Branch not found"));
        
        User registeredBy = null;
        if (registrationDTO.getRegisteredByUserId() != null) {
            registeredBy = userRepository.findById(registrationDTO.getRegisteredByUserId())
                    .orElse(null);
        }

        String patientSmartId = sequenceGenerator.generatePatientId(branch.getBranchCode());

        Patient patient = Patient.builder()
                .patientId(patientSmartId)
                .patientNumber(patientSmartId) // Using same for patientNumber for now
                .firstName(registrationDTO.getFirstName())
                .lastName(registrationDTO.getLastName())
                .email(registrationDTO.getEmail())
                .phoneNumber(registrationDTO.getPhone())
                .gender(Patient.Gender.valueOf(registrationDTO.getGender().toUpperCase()))
                .dateOfBirth(registrationDTO.getDateOfBirth())
                .address(registrationDTO.getAddress())
                .branch(branch)
                .registeredBy(registeredBy)
                .build();

        Patient savedPatient = patientRepository.save(patient);
        return mapToDTO(savedPatient);
    }

    @Override
    @Transactional(readOnly = true)
    @SuppressWarnings("null")
    public PatientDTO getPatientById(Long id) {
        return patientRepository.findById(id)
                .map(this::mapToDTO)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public PatientDTO getPatientBySmartId(String patientId) {
        return patientRepository.findByPatientId(patientId)
                .map(this::mapToDTO)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<PatientDTO> getAllPatients() {
        return patientRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private PatientDTO mapToDTO(Patient patient) {
        return PatientDTO.builder()
                .id(patient.getId())
                .patientId(patient.getPatientId())
                .firstName(patient.getFirstName())
                .lastName(patient.getLastName())
                .email(patient.getEmail())
                .phone(patient.getPhoneNumber())
                .gender(patient.getGender().name())
                .dateOfBirth(patient.getDateOfBirth())
                .address(patient.getAddress())
                .branchName(patient.getBranch() != null ? patient.getBranch().getBranchName() : null)
                .createdAt(patient.getCreatedAt())
                .build();
    }
}
