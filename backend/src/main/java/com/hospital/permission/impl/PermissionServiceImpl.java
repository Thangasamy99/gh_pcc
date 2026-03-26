package com.hospital.permission.impl;

import com.hospital.auth.model.Permission;
import com.hospital.auth.repository.PermissionRepository;
import com.hospital.permission.dto.PermissionDTO;
import com.hospital.permission.service.PermissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PermissionServiceImpl implements PermissionService {

    private final PermissionRepository permissionRepository;

    @Override
    public List<PermissionDTO> getAllPermissions() {
        return permissionRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<PermissionDTO> getPermissionsByModule(String module) {
        return permissionRepository.findByModule(module).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
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
