package com.hospital.ward.model;

import com.hospital.multibranch.model.Branch;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "wards")
public class Ward {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "ward_code", unique = true, nullable = false)
    private String wardCode;
    
    @Column(name = "ward_name", nullable = false)
    private String wardName;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "ward_type", nullable = false)
    private WardType wardType;
    
    @Column(name = "total_beds", nullable = false)
    private Integer total_beds;
    
    @Column(name = "available_beds", nullable = false)
    private Integer available_beds;
    
    @Column(name = "occupied_beds", nullable = false)
    private Integer occupied_beds;
    
    private String floor;
    
    @ManyToOne
    @JoinColumn(name = "branch_id", nullable = false)
    private Branch branch;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
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
    
    public enum WardType {
        MALE, FEMALE, MATERNITY, CHILDREN, ICU, PRIVATE
    }

    // Helper methods to match SQL snake_case names if needed by DTOs or just using camelCase in Java
    public Integer getTotalBeds() { return total_beds; }
    public void setTotalBeds(Integer totalBeds) { this.total_beds = totalBeds; }
    public Integer getAvailableBeds() { return available_beds; }
    public void setAvailableBeds(Integer availableBeds) { this.available_beds = availableBeds; }
    public Integer getOccupiedBeds() { return occupied_beds; }
    public void setOccupiedBeds(Integer occupiedBeds) { this.occupied_beds = occupiedBeds; }
}
