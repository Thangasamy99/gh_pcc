package com.hospital.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class JwtResponseDTO {

    @NotBlank(message = "Refresh token is required")
    private String refreshToken;
}
