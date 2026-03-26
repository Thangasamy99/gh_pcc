package com.hospital.auth.service.impl;

import com.hospital.auth.dto.LoginRequestDTO;
import com.hospital.auth.dto.LoginResponseDTO;
import com.hospital.auth.model.User;
import com.hospital.auth.model.UserSession;
import com.hospital.auth.repository.UserRepository;
import com.hospital.auth.repository.UserSessionRepository;
import com.hospital.auth.service.api.AuthService;
import com.hospital.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private static final int MAX_FAILED_ATTEMPTS = 5;

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;
    private final UserSessionRepository sessionRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public LoginResponseDTO login(LoginRequestDTO request, String ipAddress, String userAgent) {
        log.info("Login attempt for user: {}", request.getUsername());

        // Find user first (to check lock / failed attempts)
        User user = userRepository.findByUsernameOrEmail(request.getUsername(), request.getUsername())
                .orElseThrow(() -> {
                    log.warn("Login failed - user not found: {}", request.getUsername());
                    return new BadCredentialsException("Invalid username or password");
                });

        // Check if account is locked
        if (Boolean.TRUE.equals(user.getIsLocked())) {
            log.warn("Login failed - account locked: {}", user.getUsername());
            throw new LockedException("Account is locked. Contact administrator.");
        }

        // Check if account is active
        if (!Boolean.TRUE.equals(user.getIsActive())) {
            log.warn("Login failed - account disabled: {}", user.getUsername());
            throw new DisabledException("Account is disabled. Contact administrator.");
        }

        // Authenticate via Spring Security (checks password)
        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            user.getUsername(), // always use username for authentication
                            request.getPassword()));
        } catch (BadCredentialsException e) {
            // Increment failed attempts
            userRepository.incrementFailedAttempts(user.getId());

            int currentFailed = (user.getFailedAttempts() == null ? 0 : user.getFailedAttempts()) + 1;
            log.warn("Login failed - wrong password for user: {}. Failed attempts: {}", user.getUsername(),
                    currentFailed);

            if (currentFailed >= MAX_FAILED_ATTEMPTS) {
                userRepository.lockUser(user.getId());
                log.warn("Account locked after {} failed attempts: {}", MAX_FAILED_ATTEMPTS, user.getUsername());
                throw new LockedException("Account locked after " + MAX_FAILED_ATTEMPTS + " failed attempts.");
            }

            throw new BadCredentialsException(
                    "Invalid username or password. Attempts remaining: " + (MAX_FAILED_ATTEMPTS - currentFailed));
        }

        // Login successful — set security context
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Reset failed attempts and update last login
        userRepository.updateLastLogin(user.getId(), LocalDateTime.now(), ipAddress);

        // Generate tokens
        String accessToken = tokenProvider.generateToken(authentication);
        String refreshToken = UUID.randomUUID().toString();
        String sessionId = UUID.randomUUID().toString();

        // Create and save session
        UserSession session = UserSession.builder()
                .user(user)
                .sessionToken(sessionId)
                .refreshToken(refreshToken)
                .ipAddress(ipAddress)
                .userAgent(userAgent)
                .loginTime(LocalDateTime.now())
                .expiryTime(LocalDateTime.now().plusHours(24))
                .isActive(true)
                .build();
        sessionRepository.save(session);

        log.info("Login successful for user: {} with role: {}. Session: {}", user.getUsername(),
                user.getRole() != null ? user.getRole().getRoleCode() : "none", sessionId);

        // Build and return response
        return buildLoginResponse(user, accessToken, refreshToken, sessionId);
    }

    @Override
    @Transactional
    public LoginResponseDTO refreshToken(String refreshToken) {
        if (!tokenProvider.validateToken(refreshToken)) {
            throw new BadCredentialsException("Invalid or expired refresh token");
        }

        String username = tokenProvider.getUsernameFromToken(refreshToken);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new BadCredentialsException("User not found for refresh token"));

        if (!Boolean.TRUE.equals(user.getIsActive()) || Boolean.TRUE.equals(user.getIsLocked())) {
            throw new DisabledException("Account is not accessible");
        }

        String newToken = tokenProvider.generateToken(username);
        String newSessionId = UUID.randomUUID().toString();
        
        // Create a new session for the refreshed token
        UserSession session = UserSession.builder()
                .user(user)
                .sessionToken(newSessionId)
                .refreshToken(refreshToken)
                .loginTime(LocalDateTime.now())
                .expiryTime(LocalDateTime.now().plusHours(24))
                .isActive(true)
                .build();
        sessionRepository.save(session);

        return buildLoginResponse(user, newToken, refreshToken, newSessionId);
    }

    @Override
    @Transactional
    public void logout(String username) {
        SecurityContextHolder.clearContext();
        log.info("User logged out: {}", username);
    }

    @Override
    @Transactional
    public void logoutByRefreshToken(String refreshToken) {
        sessionRepository.findByRefreshTokenAndIsActiveTrue(refreshToken).ifPresent(session -> {
            session.setIsActive(false);
            session.setLogoutTime(LocalDateTime.now());
            sessionRepository.save(session);
            log.info("Session deactivated via refresh token for user: {}", session.getUser().getUsername());
        });
        SecurityContextHolder.clearContext();
    }

    @Override
    @Transactional
    public void logoutAllDevices(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BadCredentialsException("User not found"));

        List<UserSession> activeSessions = sessionRepository.findByUserAndIsActiveTrue(user);
        activeSessions.forEach(session -> {
            session.setIsActive(false);
            session.setLogoutTime(LocalDateTime.now());
        });
        sessionRepository.saveAll(activeSessions);
        log.info("Deactivated {} active sessions for user: {}", activeSessions.size(), user.getUsername());
    }

    @Override
    @Transactional
    public boolean validateSession(String sessionToken) {
        return sessionRepository.findBySessionTokenAndIsActiveTrue(sessionToken)
                .map(session -> {
                    if (session.getExpiryTime().isBefore(LocalDateTime.now())) {
                        session.setIsActive(false);
                        sessionRepository.save(session);
                        return false;
                    }
                    session.setLastActivity(LocalDateTime.now());
                    sessionRepository.save(session);
                    return true;
                }).orElse(false);
    }

    @Override
    @Transactional
    public void changePassword(Long userId, String currentPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BadCredentialsException("User not found"));

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new BadCredentialsException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setIsPasswordExpired(false);
        user.setPasswordChangedAt(LocalDateTime.now());
        userRepository.save(user);

        log.info("Password changed for user: {}", user.getUsername());
    }

    // ═══════════════════════════════════════════════════════════════════
    // Private helper
    // ═══════════════════════════════════════════════════════════════════

    private LoginResponseDTO buildLoginResponse(User user, String accessToken, String refreshToken, String sessionId) {
        return LoginResponseDTO.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .sessionId(sessionId)
                .tokenType("Bearer")
                .expiresIn(tokenProvider.getExpirationMs())
                // User fields
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .fullName(user.getFirstName() + " " + user.getLastName())
                .staffId(user.getStaffId())
                .phone(user.getPhone())
                .profilePhoto(user.getProfilePhoto())
                // Role fields
                .roleId(user.getRole() != null ? user.getRole().getId() : null)
                .roleName(user.getRole() != null ? user.getRole().getRoleName() : null)
                .roleCode(user.getRole() != null ? user.getRole().getRoleCode() : null)
                // Branch fields
                .branchId(user.getPrimaryBranch() != null ? user.getPrimaryBranch().getId() : null)
                .branchName(user.getPrimaryBranch() != null ? user.getPrimaryBranch().getBranchName() : null)
                .branchCode(user.getPrimaryBranch() != null ? user.getPrimaryBranch().getBranchCode() : null)
                // Flags
                .isPasswordExpired(Boolean.TRUE.equals(user.getIsPasswordExpired()))
                .isActive(Boolean.TRUE.equals(user.getIsActive()))
                .build();
    }
}
