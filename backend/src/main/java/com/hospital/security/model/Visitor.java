package com.hospital.security.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import com.hospital.multibranch.model.Branch;
import com.hospital.auth.model.User;

@Entity
@Table(name = "visitors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Visitor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "visitor_id", unique = true, nullable = false)
    private String visitorId;

    @Column(nullable = false)
    private String visitorName;

    private String phoneNumber;
    private String idProof;
    private String relationship;

    private String patientName;
    private Long patientId;
    private Long wardId;
    private String roomNumber;
    private String bedNumber;
    private String purposeOfVisit;

    @Column(name = "entry_time", nullable = false)
    private LocalDateTime entryTime;

    private LocalDateTime expectedExitTime;
    private LocalDateTime exitTime;

    @Column(name = "visitor_pass_number", unique = true)
    private String visitorPassNumber;

    private String status; // INSIDE, EXITED

    private String registeredBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    private Branch branch;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;
}
