package com.hospital.role.dto;

import lombok.*;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoleDTO {
    private Long id;
    private String roleName;
    private String roleCode;
    private String description;
    private Integer roleLevel;
    private String department;
    private Boolean isSystemRole;
    private Set<Long> permissionIds;
}
