package com.hospital.role.impl;

import com.hospital.auth.model.Role;
import com.hospital.auth.model.Permission;
import com.hospital.auth.repository.RoleRepository;
import com.hospital.auth.repository.PermissionRepository;
import com.hospital.role.dto.RoleDTO;
import com.hospital.role.service.RoleService;
import com.hospital.common.exception.ResourceNotFoundException;
import com.hospital.common.exception.IllegalOperationException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.HashSet;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;

    @Override
    public List<RoleDTO> getAllRoles() {
        return roleRepository.findAllOrderByLevel().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public RoleDTO getRoleById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Role ID cannot be null");
        }
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + id));
        return toDTO(role);
    }

    @Override
    @Transactional
    public RoleDTO createRole(RoleDTO roleDTO) {
        if (roleRepository.existsByRoleCode(roleDTO.getRoleCode())) {
            throw new IllegalOperationException("Role code already exists: " + roleDTO.getRoleCode());
        }

        Role role = Role.builder()
                .roleName(roleDTO.getRoleName())
                .roleCode(roleDTO.getRoleCode())
                .description(roleDTO.getDescription())
                .roleLevel(roleDTO.getRoleLevel() != null ? roleDTO.getRoleLevel() : 1)
                .department(roleDTO.getDepartment())
                .isSystemRole(false)
                .build();

        if (roleDTO.getPermissionIds() != null && !roleDTO.getPermissionIds().isEmpty()) {
            Set<Permission> permissions = new HashSet<>(permissionRepository.findAllById(roleDTO.getPermissionIds()));
            role.setPermissions(permissions);
        }

        Role savedRole = roleRepository.save(role);
        if (savedRole == null) {
            throw new IllegalOperationException("Failed to save role");
        }
        return toDTO(savedRole);
    }

    @Override
    @Transactional
    public RoleDTO updateRole(Long id, RoleDTO roleDTO) {
        if (id == null) {
            throw new IllegalArgumentException("Role ID cannot be null");
        }
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + id));

        if (Boolean.TRUE.equals(role.getIsSystemRole()) && "ROLE_SUPER_ADMIN".equals(role.getRoleCode())) {
            throw new IllegalOperationException("Super Admin role cannot be modified.");
        }

        role.setRoleName(roleDTO.getRoleName());
        role.setDescription(roleDTO.getDescription());
        role.setRoleLevel(roleDTO.getRoleLevel());
        role.setDepartment(roleDTO.getDepartment());

        if (roleDTO.getPermissionIds() != null) {
            Set<Permission> permissions = new HashSet<>(permissionRepository.findAllById(roleDTO.getPermissionIds()));
            role.setPermissions(permissions);
        }

        return toDTO(roleRepository.save(role));
    }

    @Override
    @Transactional
    public void deleteRole(Long id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + id));

        if (Boolean.TRUE.equals(role.getIsSystemRole())) {
            throw new IllegalOperationException("System roles cannot be deleted.");
        }

        long userCount = roleRepository.countUsersByRoleId(id);
        if (userCount > 0) {
            throw new IllegalOperationException("Cannot delete role with assigned users. Count: " + userCount);
        }

        roleRepository.delete(role);
    }

    @Override
    public List<RoleDTO> getRolesByDepartment(String department) {
        return roleRepository.findByDepartment(department).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<String> getAllDepartments() {
        return roleRepository.findAllDepartments();
    }

    @Override
    public boolean checkRoleName(String name) {
        return roleRepository.existsByRoleName(name);
    }

    @Override
    public long countSystemRoles() {
        return roleRepository.countByIsSystemRoleTrue();
    }

    private RoleDTO toDTO(Role role) {
        return RoleDTO.builder()
                .id(role.getId())
                .roleName(role.getRoleName())
                .roleCode(role.getRoleCode())
                .description(role.getDescription())
                .roleLevel(role.getRoleLevel())
                .department(role.getDepartment())
                .isSystemRole(role.getIsSystemRole())
                .permissionIds(role.getPermissions() != null
                        ? role.getPermissions().stream().map(Permission::getId).collect(Collectors.toSet())
                        : new HashSet<>())
                .build();
    }
}
