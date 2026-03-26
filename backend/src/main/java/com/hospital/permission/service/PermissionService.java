package com.hospital.permission.service;

import com.hospital.permission.dto.PermissionDTO;
import java.util.List;

public interface PermissionService {
    List<PermissionDTO> getAllPermissions();

    List<PermissionDTO> getPermissionsByModule(String module);
}
