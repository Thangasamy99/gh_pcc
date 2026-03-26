package com.hospital.ward.model;

import com.hospital.patient.model.Patient;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "beds", uniqueConstraints = {@UniqueConstraint(columnNames = {"room_id", "bed_number"})})
public class Bed {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "bed_number", nullable = false)
    private String bedNumber;
    
    @ManyToOne
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;
    
    @ManyToOne
    @JoinColumn(name = "ward_id", nullable = false)
    private Ward ward;
    
    @Enumerated(EnumType.STRING)
    private BedStatus status = BedStatus.AVAILABLE;
    
    @ManyToOne
    @JoinColumn(name = "current_patient_id")
    private Patient currentPatient;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public enum BedStatus {
        AVAILABLE, OCCUPIED, MAINTENANCE
    }
}
