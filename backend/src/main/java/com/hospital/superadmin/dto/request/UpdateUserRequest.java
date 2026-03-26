package com.hospital.superadmin.dto.request;
import lombok.Data;

@Data
public class UpdateUserRequest {
    private String firstName;
    private String lastName;
    private String phone;
    private String email;
    private Long branchId;
}
