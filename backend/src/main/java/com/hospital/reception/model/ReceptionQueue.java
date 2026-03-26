package com.hospital.reception.model;

import com.hospital.auth.model.User;
import com.hospital.multibranch.model.Branch;
import com.hospital.security.model.PatientEntry;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reception_queue")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ReceptionQueue {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_entry_id", nullable = false)
    private PatientEntry patientEntry;

    @Enumerated(EnumType.STRING)
    @Column(name = "queue_status", nullable = false)
    private QueueStatus queueStatus;

    @Column(name = "queue_number")
    private Integer queueNumber;

    @Builder.Default
    @Column(name = "vitals_completed")
    private Boolean vitalsCompleted = false;

    @Builder.Default
    @Column(name = "sent_to_cashier")
    private Boolean sentToCashier = false;

    @Builder.Default
    @Column(name = "payment_completed")
    private Boolean paymentCompleted = false;

    @Column(name = "consultation_room")
    private String consultationRoom;

    @Builder.Default
    @Column(name = "sent_to_doctor")
    private Boolean sentToDoctor = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_doctor_id")
    private User assignedDoctor;

    @Column(name = "queue_time")
    private LocalDateTime queueTime;

    @Column(name = "vitals_time")
    private LocalDateTime vitalsTime;

    @Column(name = "cashier_time")
    private LocalDateTime cashierTime;

    @Column(name = "doctor_time")
    private LocalDateTime doctorTime;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "managed_by", nullable = false)
    private User managedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    private Branch branch;

    @Builder.Default
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Builder.Default
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.queueStatus == null) this.queueStatus = QueueStatus.WAITING;
        if (this.queueTime == null) this.queueTime = LocalDateTime.now();
        if (this.vitalsCompleted == null) this.vitalsCompleted = false;
        if (this.sentToCashier == null) this.sentToCashier = false;
        if (this.paymentCompleted == null) this.paymentCompleted = false;
        if (this.sentToDoctor == null) this.sentToDoctor = false;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public enum QueueStatus {
        WAITING,
        VITALS_COMPLETED,
        SENT_TO_CASHIER,
        PAYMENT_COMPLETED,
        ASSIGNED_ROOM,
        SENT_TO_DOCTOR,
        COMPLETED
    }
}
