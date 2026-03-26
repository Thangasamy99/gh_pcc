package com.hospital.auth.repository;

import com.hospital.auth.model.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, Long> {

    Optional<Permission> findByPermissionCode(String permissionCode);

    List<Permission> findByModule(String module);

    @Query("SELECT p FROM Permission p WHERE p.id IN " +
            "(SELECT rp.id FROM Role r JOIN r.permissions rp WHERE r.id = :roleId)")
    List<Permission> findByRoleId(@Param("roleId") Long roleId);

    boolean existsByPermissionCode(String permissionCode);
}
