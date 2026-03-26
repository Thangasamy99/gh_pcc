package com.hospital.permission.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PermissionDTO {
    private Long id;
    private String permissionName;
    private String permissionCode;
    private String module;
    private String description;
}
