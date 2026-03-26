package com.hospital.patient.repository;

import com.hospital.patient.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {

    Optional<Patient> findByPatientId(String patientId);

    boolean existsByPatientId(String patientId);

    @Query("SELECT COUNT(p) > 0 FROM Patient p WHERE p.patientId = :patientId")
    boolean isPatientIdTaken(@Param("patientId") String patientId);
}
