package com.hospital.rolepermission.impl;

import com.hospital.auth.model.Role;
import com.hospital.auth.model.Permission;
import com.hospital.auth.repository.RoleRepository;
import com.hospital.auth.repository.PermissionRepository;
import com.hospital.permission.dto.PermissionDTO;
import com.hospital.rolepermission.service.RolePermissionService;
import com.hospital.common.exception.ResourceNotFoundException;
import com.hospital.common.exception.IllegalOperationException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.HashSet;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RolePermissionServiceImpl implements RolePermissionService {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;

    @Override
    public List<PermissionDTO> getPermissionsByRole(Long roleId) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + roleId));
        return role.getPermissions().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void assignPermissionsToRole(Long roleId, List<Long> permissionIds, Long userId) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + roleId));

        if (role.getIsSystemRole()) {
            throw new IllegalOperationException("System roles cannot be modified.");
        }

        Set<Permission> permissions = new HashSet<>(permissionRepository.findAllById(permissionIds));
        role.getPermissions().addAll(permissions);
        roleRepository.save(role);
    }

    @Override
    @Transactional
    public void removePermissionFromRole(Long roleId, Long permissionId, Long userId) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + roleId));

        if (role.getIsSystemRole()) {
            throw new IllegalOperationException("System roles cannot be modified.");
        }

        Permission permission = permissionRepository.findById(permissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Permission not found with id: " + permissionId));

        role.getPermissions().remove(permission);
        roleRepository.save(role);
    }

    @Override
    @Transactional
    public void bulkUpdateRolePermissions(Long roleId, List<Long> permissionIds, Long userId) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + roleId));

        if (role.getIsSystemRole() && "ROLE_SUPER_ADMIN".equals(role.getRoleCode())) {
            throw new IllegalOperationException("Super Admin role permissions cannot be modified.");
        }

        Set<Permission> permissions = new HashSet<>(permissionRepository.findAllById(permissionIds));
        role.setPermissions(permissions);
        roleRepository.save(role);
    }

    @Override
    public boolean hasPermission(Long roleId, String permissionName) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + roleId));
        return role.getPermissions().stream()
                .anyMatch(p -> p.getPermissionName().equalsIgnoreCase(permissionName));
    }

    private PermissionDTO toDTO(Permission permission) {
        return PermissionDTO.builder()
                .id(permission.getId())
                .permissionName(permission.getPermissionName())
                .permissionCode(permission.getPermissionCode())
                .module(permission.getModule())
                .description(permission.getDescription())
                .build();
    }
}
