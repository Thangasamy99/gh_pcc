package com.hospital.superadmin.dto.response;
import lombok.Data;

@Data
public class RoleResponse {
    private Long id;
    private String roleName;
    private String roleCode;
    private String description;
    private Integer roleLevel;
    private Boolean isSystemRole;
    private Integer userCount;
    private Integer permissionCount;
}
