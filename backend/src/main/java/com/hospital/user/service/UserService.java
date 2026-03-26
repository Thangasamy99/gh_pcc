package com.hospital.user.service;

import com.hospital.user.dto.UserCreateRequest;
import com.hospital.user.dto.UserResponse;
import java.util.List;

public interface UserService {
    List<UserResponse> getAllUsers();

    UserResponse getUserById(Long id);

    UserResponse createUser(UserCreateRequest request);

    UserResponse updateUser(Long id, UserCreateRequest request);

    void deleteUser(Long id);

    void lockUser(Long id);

    void unlockUser(Long id);

    void resetPassword(Long id, String newPassword);

    boolean existsByUsername(String username);

    boolean existsByStaffId(String staffId);
}
