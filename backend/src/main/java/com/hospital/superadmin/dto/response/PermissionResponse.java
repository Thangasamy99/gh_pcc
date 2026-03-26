package com.hospital.superadmin.dto.response;
import lombok.Data;

@Data
public class PermissionResponse {
    private Long id;
    private String permissionName;
    private String permissionCode;
    private String module;
    private String description;
}
