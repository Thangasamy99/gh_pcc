package com.hospital.ward.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "rooms", uniqueConstraints = {@UniqueConstraint(columnNames = {"ward_id", "room_number"})})
public class Room {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "room_number", nullable = false)
    private String roomNumber;
    
    @ManyToOne
    @JoinColumn(name = "ward_id", nullable = false)
    private Ward ward;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "room_type")
    private RoomType roomType = RoomType.GENERAL;
    
    @Column(name = "total_beds", nullable = false)
    private Integer totalBeds;
    
    @Column(name = "available_beds", nullable = false)
    private Integer availableBeds;
    
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
    
    public enum RoomType {
        GENERAL, PRIVATE, SHARED
    }
}
