package com.hospital.auth.controller;

import com.hospital.auth.dto.JwtResponseDTO;
import com.hospital.auth.dto.LoginRequestDTO;
import com.hospital.auth.dto.LoginResponseDTO;
import com.hospital.auth.service.api.AuthService;
import com.hospital.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/auth")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Authentication", description = "Login, Logout and Token management")
public class AuthController {

    private final AuthService authService;

    // ── POST /api/v1/auth/login ────────────────────────────────────────
    @PostMapping("/login")
    @Operation(summary = "Login", description = "Authenticate with username/email and password. Returns JWT token.")
    public ResponseEntity<ApiResponse<LoginResponseDTO>> login(
            @Valid @RequestBody LoginRequestDTO request,
            HttpServletRequest httpRequest) {

        String ipAddress = getClientIp(httpRequest);
        String userAgent = httpRequest.getHeader("User-Agent");
        log.info("Login request from IP: {} for user: {}", ipAddress, request.getUsername());

        LoginResponseDTO response = authService.login(request, ipAddress, userAgent);
        return ResponseEntity.ok(new ApiResponse<>(true, "Login successful", response));
    }

    // ── POST /api/v1/auth/refresh ──────────────────────────────────────
    @PostMapping("/refresh")
    @Operation(summary = "Refresh token", description = "Get a new access token using a valid refresh token.")
    public ResponseEntity<ApiResponse<LoginResponseDTO>> refreshToken(
            @Valid @RequestBody JwtResponseDTO request) {

        LoginResponseDTO response = authService.refreshToken(request.getRefreshToken());
        return ResponseEntity.ok(new ApiResponse<>(true, "Token refreshed successfully", response));
    }

    // ── POST /api/v1/auth/logout ───────────────────────────────────────
    @PostMapping("/logout")
    @Operation(summary = "Logout", description = "Invalidate the current session.")
    public ResponseEntity<ApiResponse<Void>> logout(@RequestBody(required = false) JwtResponseDTO request) {
        if (request != null && request.getRefreshToken() != null) {
            authService.logoutByRefreshToken(request.getRefreshToken());
        } else {
            authService.logout("authenticated-user");
        }
        return ResponseEntity.ok(new ApiResponse<>(true, "Logged out successfully", null));
    }

    // ── POST /api/v1/auth/logout-all ──────────────────────────────────
    @PostMapping("/logout-all")
    @Operation(summary = "Logout from all devices", description = "Invalidate all active sessions for the user.")
    public ResponseEntity<ApiResponse<Void>> logoutAllDevices(@RequestParam Long userId) {
        authService.logoutAllDevices(userId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Logged out from all devices", null));
    }

    // ── GET /api/v1/auth/session/{token}/validate ──────────────────────
    @GetMapping("/session/{token}/validate")
    @Operation(summary = "Validate session", description = "Check if a session token is still valid.")
    public ResponseEntity<ApiResponse<Boolean>> validateSession(@PathVariable String token) {
        boolean isValid = authService.validateSession(token);
        return ResponseEntity.ok(new ApiResponse<>(true, "Session validation complete", isValid));
    }

    // ── GET /api/v1/auth/health ────────────────────────────────────────
    @GetMapping("/health")
    @Operation(summary = "Health check", description = "Validates the auth service is running.")
    public ResponseEntity<ApiResponse<String>> health() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Auth service is running", "OK"));
    }

    // ── Helper ────────────────────────────────────────────────────────
    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        return request.getRemoteAddr();
    }
}
