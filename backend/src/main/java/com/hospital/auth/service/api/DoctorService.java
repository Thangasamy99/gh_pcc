package com.hospital.auth.service.api;

import com.hospital.auth.dto.DoctorDTO;
import java.util.List;

public interface DoctorService {
    DoctorDTO createDoctor(DoctorDTO.CreateRequest request);
    List<DoctorDTO> getAllDoctors();
    List<DoctorDTO> getAvailableDoctorsByBranch(Long branchId);
    List<DoctorDTO> getAvailableDoctorsByRoom(String consultationRoom);
    DoctorDTO updateAvailability(Long doctorId, String status);
}
