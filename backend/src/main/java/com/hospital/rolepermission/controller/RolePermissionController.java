package com.hospital.rolepermission.controller;

import com.hospital.common.dto.ApiResponse;
import com.hospital.permission.dto.PermissionDTO;
import com.hospital.rolepermission.service.RolePermissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/superadmin/role-permissions")
@RequiredArgsConstructor
public class RolePermissionController {

    private final RolePermissionService rolePermissionService;

    @GetMapping("/role/{roleId}")
    public ResponseEntity<ApiResponse<List<PermissionDTO>>> getPermissionsByRole(@PathVariable Long roleId) {
        return ResponseEntity.ok(ApiResponse.success(rolePermissionService.getPermissionsByRole(roleId)));
    }

    @PostMapping("/role/{roleId}/permissions")
    public ResponseEntity<ApiResponse<Void>> assignPermissionsToRole(
            @PathVariable Long roleId,
            @RequestBody List<Long> permissionIds,
            @RequestHeader(value = "X-User-Id", required = false) Long userId) {
        rolePermissionService.assignPermissionsToRole(roleId, permissionIds, userId);
        return ResponseEntity.ok(ApiResponse.success("Permissions assigned successfully"));
    }

    @DeleteMapping("/role/{roleId}/permission/{permissionId}")
    public ResponseEntity<ApiResponse<Void>> removePermissionFromRole(
            @PathVariable Long roleId,
            @PathVariable Long permissionId,
            @RequestHeader(value = "X-User-Id", required = false) Long userId) {
        rolePermissionService.removePermissionFromRole(roleId, permissionId, userId);
        return ResponseEntity.ok(ApiResponse.success("Permission removed successfully"));
    }

    @PutMapping("/role/{roleId}/permissions")
    public ResponseEntity<ApiResponse<Void>> bulkUpdateRolePermissions(
            @PathVariable Long roleId,
            @RequestBody List<Long> permissionIds,
            @RequestHeader(value = "X-User-Id", required = false) Long userId) {
        rolePermissionService.bulkUpdateRolePermissions(roleId, permissionIds, userId);
        return ResponseEntity.ok(ApiResponse.success("Permissions updated successfully"));
    }

    @GetMapping("/check")
    public ResponseEntity<ApiResponse<Boolean>> checkPermission(
            @RequestParam Long roleId,
            @RequestParam String permissionName) {
        return ResponseEntity.ok(ApiResponse.success(rolePermissionService.hasPermission(roleId, permissionName)));
    }
}
