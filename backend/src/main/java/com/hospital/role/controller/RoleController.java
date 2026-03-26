package com.hospital.role.controller;

import com.hospital.common.dto.ApiResponse;
import com.hospital.role.dto.RoleDTO;
import com.hospital.role.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/superadmin/roles")
@RequiredArgsConstructor
public class RoleController {

    private final RoleService roleService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<RoleDTO>>> getAllRoles() {
        return ResponseEntity.ok(ApiResponse.success(roleService.getAllRoles()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RoleDTO>> getRoleById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(roleService.getRoleById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RoleDTO>> createRole(@RequestBody RoleDTO roleDTO) {
        return ResponseEntity.ok(ApiResponse.success(roleService.createRole(roleDTO)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<RoleDTO>> updateRole(@PathVariable Long id, @RequestBody RoleDTO roleDTO) {
        return ResponseEntity.ok(ApiResponse.success(roleService.updateRole(id, roleDTO)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRole(@PathVariable Long id) {
        roleService.deleteRole(id);
        return ResponseEntity.ok(ApiResponse.success("Role deleted successfully"));
    }

    @GetMapping("/department/{department}")
    public ResponseEntity<ApiResponse<List<RoleDTO>>> getRolesByDepartment(@PathVariable String department) {
        return ResponseEntity.ok(ApiResponse.success(roleService.getRolesByDepartment(department)));
    }

    @GetMapping("/departments")
    public ResponseEntity<ApiResponse<List<String>>> getAllDepartments() {
        return ResponseEntity.ok(ApiResponse.success(roleService.getAllDepartments()));
    }

    @GetMapping("/check-name")
    public ResponseEntity<ApiResponse<Boolean>> checkRoleName(@RequestParam String name) {
        return ResponseEntity.ok(ApiResponse.success(roleService.checkRoleName(name)));
    }

    @GetMapping("/counts/system")
    public ResponseEntity<ApiResponse<Long>> countSystemRoles() {
        return ResponseEntity.ok(ApiResponse.success(roleService.countSystemRoles()));
    }
}
