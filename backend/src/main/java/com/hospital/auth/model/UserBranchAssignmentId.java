package com.hospital.auth.model;
import java.io.Serializable;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @EqualsAndHashCode
public class UserBranchAssignmentId implements Serializable {
    private Long user;
    private Long branch;
}
