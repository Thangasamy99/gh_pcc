package com.hospital.rolepermission.service;

import com.hospital.permission.dto.PermissionDTO;
import java.util.List;

public interface RolePermissionService {
    List<PermissionDTO> getPermissionsByRole(Long roleId);
    void assignPermissionsToRole(Long roleId, List<Long> permissionIds, Long userId);
    void removePermissionFromRole(Long roleId, Long permissionId, Long userId);
    void bulkUpdateRolePermissions(Long roleId, List<Long> permissionIds, Long userId);
    boolean hasPermission(Long roleId, String permissionName);
}
