package com.hospital.permission.controller;

import com.hospital.common.dto.ApiResponse;
import com.hospital.permission.dto.PermissionDTO;
import com.hospital.permission.service.PermissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/superadmin/permissions")
@RequiredArgsConstructor
public class PermissionController {

    private final PermissionService permissionService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<PermissionDTO>>> getAllPermissions() {
        return ResponseEntity.ok(ApiResponse.success(permissionService.getAllPermissions()));
    }

    @GetMapping("/module/{module}")
    public ResponseEntity<ApiResponse<List<PermissionDTO>>> getPermissionsByModule(@PathVariable String module) {
        return ResponseEntity.ok(ApiResponse.success(permissionService.getPermissionsByModule(module)));
    }
}
