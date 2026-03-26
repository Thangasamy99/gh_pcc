package com.hospital.reception.service;

import com.hospital.reception.dto.PatientVitalsDTO;
import com.hospital.reception.dto.ReceptionDashboardDTO;
import com.hospital.reception.dto.ReceptionQueueDTO;
import com.hospital.reception.model.ReceptionQueue;
import com.hospital.security.dto.PatientEntryResponseDTO;

import java.util.List;

public interface ReceptionService {

    // Dashboard
    ReceptionDashboardDTO getDashboardData(Long branchId);

    // Patient Entry from Security
    List<PatientEntryResponseDTO> getPendingPatients(Long branchId);
    PatientEntryResponseDTO getPatientEntryById(Long patientEntryId);
    ReceptionQueueDTO addPatientToQueue(Long patientEntryId, Long branchId, String managedBy);

    // Vitals Management
    PatientVitalsDTO recordVitals(PatientVitalsDTO vitalsDTO, Long branchId, String recordedBy);
    PatientVitalsDTO getPatientVitals(Long patientEntryId);
    List<PatientVitalsDTO> getTodayVitals(Long branchId);

    // Queue Management
    List<ReceptionQueueDTO> getWaitingQueue(Long branchId);
    ReceptionQueueDTO sendToCashier(Long patientEntryId, Long branchId, String managedBy);
    ReceptionQueueDTO assignConsultationRoom(Long patientEntryId, String consultationRoom, Long branchId, String managedBy);
    ReceptionQueueDTO assignConsultationRoomWithDoctor(Long patientEntryId, String consultationRoom, Long doctorId, Long branchId, String managedBy);
    ReceptionQueueDTO sendToDoctor(Long patientEntryId, Long branchId, String managedBy);
    List<ReceptionQueueDTO> getTodayQueue(Long branchId);

    // Patient List
    List<PatientEntryResponseDTO> getTodayPatients(Long branchId);
    List<ReceptionQueueDTO> getPatientsByStatus(ReceptionQueue.QueueStatus status, Long branchId);
}
