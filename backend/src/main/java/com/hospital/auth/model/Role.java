package com.hospital.auth.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "roles")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Role {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "role_name", unique = true, nullable = false, length = 50)
    private String roleName;

    @Column(name = "role_code", unique = true, nullable = false, length = 30)
    private String roleCode;

    @Column(name = "role_abbreviation", nullable = false, length = 10)
    private String roleAbbreviation;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Builder.Default
    @Column(name = "role_level")
    private Integer roleLevel = 1;

    @Column(name = "department", length = 100)
    private String department;

    @Builder.Default
    @Column(name = "is_system_role")
    private Boolean isSystemRole = false;

    @Builder.Default
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "role_permissions",
        joinColumns        = @JoinColumn(name = "role_id"),
        inverseJoinColumns = @JoinColumn(name = "permission_id")
    )
    private Set<Permission> permissions = new java.util.HashSet<>();



    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() { this.createdAt = LocalDateTime.now(); }
}
