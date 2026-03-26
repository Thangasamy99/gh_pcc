package com.hospital.role.service;

import com.hospital.role.dto.RoleDTO;
import java.util.List;

public interface RoleService {
    List<RoleDTO> getAllRoles();

    RoleDTO getRoleById(Long id);

    RoleDTO createRole(RoleDTO roleDTO);

    RoleDTO updateRole(Long id, RoleDTO roleDTO);

    void deleteRole(Long id);
    List<RoleDTO> getRolesByDepartment(String department);
    List<String> getAllDepartments();
    boolean checkRoleName(String name);
    long countSystemRoles();
}
