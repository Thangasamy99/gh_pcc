package com.hospital.auth.service.impl;

import com.hospital.auth.dto.DoctorDTO;
import com.hospital.auth.model.Role;
import com.hospital.auth.model.User;
import com.hospital.auth.model.User.AvailabilityStatus;
import com.hospital.auth.repository.RoleRepository;
import com.hospital.auth.repository.UserRepository;
import com.hospital.auth.service.api.DoctorService;
import com.hospital.multibranch.model.Branch;
import com.hospital.multibranch.repository.BranchRepository;
import com.hospital.common.service.SequenceGeneratorService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoctorServiceImpl implements DoctorService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final BranchRepository branchRepository;
    private final PasswordEncoder passwordEncoder;
    private final SequenceGeneratorService sequenceGenerator;

    @Override
    @Transactional
    public DoctorDTO createDoctor(DoctorDTO.CreateRequest request) {
        Role role = roleRepository.findByRoleCode(request.getRoleCode())
                .orElseThrow(() -> new RuntimeException("Role not found"));
        
        Branch branch = branchRepository.findById(request.getBranchId())
                .orElseThrow(() -> new RuntimeException("Branch not found"));

        String staffId = sequenceGenerator.generateStaffId(branch.getBranchCode(), role.getRoleAbbreviation());

        User doctor = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phone(request.getPhone())
                .gender(request.getGender())
                .qualification(request.getQualification())
                .experienceYears(request.getExperienceYears())
                .consultationRoom(request.getConsultationRoom())
                .specialization(request.getSpecialization())
                .availabilityStatus(request.getAvailabilityStatus() != null ? 
                        AvailabilityStatus.valueOf(request.getAvailabilityStatus().toUpperCase()) : 
                        AvailabilityStatus.OFFLINE)
                .role(role)
                .primaryBranch(branch)
                .staffId(staffId)
                .isActive(true)
                .createdAt(LocalDateTime.now())
                .build();

        User savedDoctor = userRepository.save(doctor);
        return mapToDTO(savedDoctor);
    }

    @Override
    public List<DoctorDTO> getAllDoctors() {
        return userRepository.findAll().stream()
                .filter(u -> u.getRole().getRoleCode().matches("DOCTOR|SURGEON|SPECIALIST"))
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<DoctorDTO> getAvailableDoctorsByBranch(Long branchId) {
        return userRepository.findAvailableDoctorsByBranchId(branchId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<DoctorDTO> getAvailableDoctorsByRoom(String consultationRoom) {
        return userRepository.findAvailableDoctorsByRoom(consultationRoom).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public DoctorDTO updateAvailability(Long doctorId, String status) {
        User doctor = userRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        doctor.setAvailabilityStatus(AvailabilityStatus.valueOf(status.toUpperCase()));
        return mapToDTO(userRepository.save(doctor));
    }

    private DoctorDTO mapToDTO(User user) {
        return DoctorDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .staffId(user.getStaffId())
                .phone(user.getPhone())
                .gender(user.getGender())
                .qualification(user.getQualification())
                .experienceYears(user.getExperienceYears())
                .consultationRoom(user.getConsultationRoom())
                .specialization(user.getSpecialization())
                .availabilityStatus(user.getAvailabilityStatus())
                .branchId(user.getPrimaryBranch() != null ? user.getPrimaryBranch().getId() : null)
                .branchName(user.getPrimaryBranch() != null ? user.getPrimaryBranch().getBranchName() : null)
                .roleCode(user.getRole().getRoleCode())
                .isActive(user.getIsActive())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
