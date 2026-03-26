package com.hospital.laboratory.service.impl;

import com.hospital.auth.model.User;
import com.hospital.auth.repository.UserRepository;
import com.hospital.common.service.SequenceGeneratorService;
import com.hospital.consultation.model.Consultation;
import com.hospital.consultation.repository.ConsultationRepository;
import com.hospital.laboratory.dto.LabOrderDTO;
import com.hospital.laboratory.dto.CreateLabOrderRequest;
import com.hospital.laboratory.model.LabOrder;
import com.hospital.laboratory.repository.LabOrderRepository;
import com.hospital.laboratory.service.api.LabOrderService;
import com.hospital.multibranch.model.Branch;
import com.hospital.multibranch.repository.BranchRepository;
import com.hospital.patient.model.Patient;
import com.hospital.patient.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LabOrderServiceImpl implements LabOrderService {

    private final LabOrderRepository labOrderRepository;
    private final ConsultationRepository consultationRepository;
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final BranchRepository branchRepository;
    private final SequenceGeneratorService sequenceGenerator;

    @Override
    @Transactional
    @SuppressWarnings("null")
    public LabOrderDTO createLabOrder(CreateLabOrderRequest request) {
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        User requestedBy = userRepository.findById(request.getRequestedByUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Branch branch = branchRepository.findById(request.getBranchId())
                .orElseThrow(() -> new RuntimeException("Branch not found"));
        
        Consultation consultation = null;
        if (request.getConsultationId() != null) {
            consultation = consultationRepository.findById(request.getConsultationId())
                    .orElseThrow(() -> new RuntimeException("Consultation not found"));
        }

        String labOrderSmartId = sequenceGenerator.generateLabOrderId(branch.getBranchCode());

        LabOrder labOrder = LabOrder.builder()
                .labOrderId(labOrderSmartId)
                .patient(patient)
                .requestedBy(requestedBy)
                .branch(branch)
                .consultation(consultation)
                .priority(request.getPriority() != null ? request.getPriority() : "NORMAL")
                .status("REQUESTED")
                .build();

        LabOrder savedLabOrder = labOrderRepository.save(labOrder);
        return mapToDTO(savedLabOrder);
    }

    @Override
    @Transactional(readOnly = true)
    @SuppressWarnings("null")
    public LabOrderDTO getLabOrderById(Long id) {
        return labOrderRepository.findById(id)
                .map(this::mapToDTO)
                .orElseThrow(() -> new RuntimeException("Lab Order not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public LabOrderDTO getLabOrderBySmartId(String labOrderId) {
        return labOrderRepository.findByLabOrderId(labOrderId)
                .map(this::mapToDTO)
                .orElseThrow(() -> new RuntimeException("Lab Order not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<LabOrderDTO> getAllLabOrders() {
        return labOrderRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private LabOrderDTO mapToDTO(LabOrder labOrder) {
        return LabOrderDTO.builder()
                .id(labOrder.getId())
                .labOrderId(labOrder.getLabOrderId())
                .patientName(labOrder.getPatient().getFirstName() + " " + labOrder.getPatient().getLastName())
                .requestedBy(labOrder.getRequestedBy().getFirstName() + " " + labOrder.getRequestedBy().getLastName())
                .branchName(labOrder.getBranch().getBranchName())
                .orderDate(labOrder.getOrderDate())
                .status(labOrder.getStatus())
                .priority(labOrder.getPriority())
                .build();
    }
}
