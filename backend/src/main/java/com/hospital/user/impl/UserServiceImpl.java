package com.hospital.user.impl;

import com.hospital.auth.model.User;
import com.hospital.auth.model.Role;
import com.hospital.multibranch.model.Branch;
import com.hospital.auth.repository.UserRepository;
import com.hospital.auth.repository.RoleRepository;
import com.hospital.multibranch.repository.BranchRepository;
import com.hospital.user.dto.UserCreateRequest;
import com.hospital.user.dto.UserResponse;
import com.hospital.user.service.UserService;
import com.hospital.common.exception.ResourceNotFoundException;
import com.hospital.common.exception.IllegalOperationException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final BranchRepository branchRepository;
    private final PasswordEncoder passwordEncoder;
    private final com.hospital.common.service.SequenceGeneratorService sequenceGeneratorService;

    @Override
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
        return toResponse(user);
    }

    @Override
    @Transactional
    public UserResponse createUser(UserCreateRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalOperationException("Username already exists: " + request.getUsername());
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalOperationException("Email already exists: " + request.getEmail());
        }
        if (request.getStaffId() != null && userRepository.existsByStaffId(request.getStaffId())) {
            throw new IllegalOperationException("Staff ID already exists: " + request.getStaffId());
        }

        Role role = roleRepository.findById(request.getRoleId())
                .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + request.getRoleId()));

        Branch branch = null;
        if (request.getPrimaryBranchId() != null) {
            branch = branchRepository.findById(request.getPrimaryBranchId())
                    .orElseThrow(
                            () -> new ResourceNotFoundException("Branch not found: " + request.getPrimaryBranchId()));
        }

        String staffId = request.getStaffId();
        if (staffId == null || staffId.trim().isEmpty()) {
            if (branch != null) {
                staffId = sequenceGeneratorService.generateStaffId(branch.getBranchCode(), role.getRoleAbbreviation());
            } else {
                // Default fallback if no branch
                staffId = sequenceGeneratorService.generateStaffId("GEN", role.getRoleAbbreviation());
            }
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .staffId(staffId)
                .phone(request.getPhone())
                .role(role)
                .primaryBranch(branch)
                .isActive(true)
                .isLocked(false)
                .isPasswordExpired(true) // Force password change on first login
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .failedAttempts(0)
                .build();

        return toResponse(userRepository.save(user));
    }

    @Override
    @Transactional
    public UserResponse updateUser(Long id, UserCreateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));

        if ("admin".equals(user.getUsername()) && !user.getUsername().equals(request.getUsername())) {
            throw new IllegalOperationException("Primary admin username cannot be changed.");
        }

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setStaffId(request.getStaffId());

        if (request.getRoleId() != null) {
            Role role = roleRepository.findById(request.getRoleId())
                    .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + request.getRoleId()));
            user.setRole(role);
        }

        if (request.getPrimaryBranchId() != null) {
            Branch branch = branchRepository.findById(request.getPrimaryBranchId())
                    .orElseThrow(
                            () -> new ResourceNotFoundException("Branch not found: " + request.getPrimaryBranchId()));
            user.setPrimaryBranch(branch);
        }

        return toResponse(userRepository.save(user));
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));

        if ("admin".equals(user.getUsername())) {
            throw new IllegalOperationException("Primary admin cannot be deleted.");
        }

        user.setIsActive(false); // Soft delete
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void lockUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
        user.setIsLocked(true);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void unlockUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
        user.setIsLocked(false);
        user.setFailedAttempts(0);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void resetPassword(Long id, String newPassword) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setIsPasswordExpired(true);
        userRepository.save(user);
    }

    @Override
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    @Override
    public boolean existsByStaffId(String staffId) {
        return userRepository.existsByStaffId(staffId);
    }

    private UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .staffId(user.getStaffId())
                .phone(user.getPhone())
                .profilePhoto(user.getProfilePhoto())
                .roleId(user.getRole().getId())
                .roleName(user.getRole().getRoleName())
                .roleCode(user.getRole().getRoleCode())
                .primaryBranchId(user.getPrimaryBranch() != null ? user.getPrimaryBranch().getId() : null)
                .branchName(user.getPrimaryBranch() != null ? user.getPrimaryBranch().getBranchName() : null)
                .isActive(user.getIsActive())
                .isLocked(user.getIsLocked())
                .lastLoginAt(user.getLastLoginAt())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
