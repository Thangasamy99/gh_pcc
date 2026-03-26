package com.hospital.auth.repository;

import com.hospital.auth.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

    Optional<Role> findByRoleCode(String roleCode);

    Optional<Role> findByRoleName(String roleName);

    boolean existsByRoleCode(String roleCode);

    @Query("SELECT r FROM Role r WHERE r.isSystemRole = true ORDER BY r.roleLevel ASC")
    List<Role> findAllSystemRoles();

    @Query("SELECT r FROM Role r ORDER BY r.roleLevel ASC")
    List<Role> findAllOrderByLevel();

    @Query("SELECT COUNT(u) FROM User u WHERE u.role.id = :roleId")
    long countUsersByRoleId(@Param("roleId") Long roleId);

    List<Role> findByDepartment(String department);

    @Query("SELECT DISTINCT r.department FROM Role r WHERE r.department IS NOT NULL")
    List<String> findAllDepartments();

    boolean existsByRoleName(String roleName);

    long countByIsSystemRoleTrue();
}
