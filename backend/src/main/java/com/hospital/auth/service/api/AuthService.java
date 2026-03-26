package com.hospital.auth.service.api;

import com.hospital.auth.dto.LoginRequestDTO;
import com.hospital.auth.dto.LoginResponseDTO;

public interface AuthService {

    LoginResponseDTO login(LoginRequestDTO request, String ipAddress, String userAgent);

    LoginResponseDTO refreshToken(String refreshToken);

    void logout(String username);

    void logoutByRefreshToken(String refreshToken);

    void logoutAllDevices(Long userId);

    boolean validateSession(String sessionToken);

    void changePassword(Long userId, String currentPassword, String newPassword);
}
