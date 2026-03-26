package com.hospital.user.dto;

import lombok.*;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserCreateRequest {
    private String username;
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private String staffId;
    private String phone;
    private Long roleId;
    private Long primaryBranchId;
}
