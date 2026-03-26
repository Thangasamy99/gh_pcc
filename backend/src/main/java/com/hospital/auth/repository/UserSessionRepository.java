package com.hospital.auth.repository;

import com.hospital.auth.model.User;
import com.hospital.auth.model.UserSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserSessionRepository extends JpaRepository<UserSession, Long> {

    Optional<UserSession> findBySessionToken(String sessionToken);

    Optional<UserSession> findBySessionTokenAndIsActiveTrue(String sessionToken);

    Optional<UserSession> findByRefreshToken(String refreshToken);

    Optional<UserSession> findByRefreshTokenAndIsActiveTrue(String refreshToken);

    List<UserSession> findByUserAndIsActiveTrue(User user);

    List<UserSession> findByUser(User user);

    @Query("SELECT s FROM UserSession s WHERE s.expiryTime < :now AND s.isActive = true")
    List<UserSession> findExpiredSessions(@Param("now") LocalDateTime now);

    @Modifying
    @Query("UPDATE UserSession s SET s.isActive = false WHERE s.expiryTime < :now")
    int deactivateExpiredSessions(@Param("now") LocalDateTime now);

    @Modifying
    @Query("DELETE FROM UserSession s WHERE s.expiryTime < :cutoff")
    int deleteOldSessions(@Param("cutoff") LocalDateTime cutoff);

    long countByUserAndIsActiveTrue(User user);

    boolean existsBySessionTokenAndIsActiveTrue(String sessionToken);
}
