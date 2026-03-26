package com.hospital.security.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import com.hospital.multibranch.model.Branch;
import com.hospital.auth.model.User;

@Entity
@Table(name = "entries")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Entry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "entry_id", unique = true, nullable = false)
    private String entryId;

    @Column(name = "entry_type", nullable = false)
    private String entryType; // NORMAL, EMERGENCY, VISITOR

    private String fullName;
    private String gender;
    private Integer age;
    private String phoneNumber;
    private String address;

    // Normal patient fields
    private String visitType;
    private String department;

    // Emergency fields
    private String emergencyType;
    private String conditionDescription;
    private String broughtBy;

    // Visitor fields
    private String visitorName;
    private String idProof;
    private String relationship;
    private String patientName;
    private Long patientId;
    private Long wardId;
    private String roomNumber;
    private String bedNumber;
    private String purposeOfVisit;
    private LocalDateTime expectedExitTime;
    private LocalDateTime exitTime;

    @Column(name = "entry_time", nullable = false)
    private LocalDateTime entryTime;

    private String status; // ACTIVE, COMPLETED, CANCELLED
    private String registeredBy;
    private String destination;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    private Branch branch;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;
}
