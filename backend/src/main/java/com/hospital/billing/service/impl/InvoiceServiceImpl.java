package com.hospital.billing.service.impl;

import com.hospital.auth.model.User;
import com.hospital.auth.repository.UserRepository;
import com.hospital.billing.dto.InvoiceDTO;
import com.hospital.billing.dto.CreateInvoiceRequest;
import com.hospital.billing.model.Invoice;
import com.hospital.billing.repository.InvoiceRepository;
import com.hospital.billing.service.api.InvoiceService;
import com.hospital.common.service.SequenceGeneratorService;
import com.hospital.multibranch.model.Branch;
import com.hospital.multibranch.repository.BranchRepository;
import com.hospital.patient.model.Patient;
import com.hospital.patient.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InvoiceServiceImpl implements InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final BranchRepository branchRepository;
    private final SequenceGeneratorService sequenceGenerator;

    @Override
    @Transactional
    @SuppressWarnings("null")
    public InvoiceDTO createInvoice(CreateInvoiceRequest request) {
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        User createdBy = userRepository.findById(request.getCreatedByUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Branch branch = branchRepository.findById(request.getBranchId())
                .orElseThrow(() -> new RuntimeException("Branch not found"));

        String invoiceSmartId = sequenceGenerator.generateInvoiceId(branch.getBranchCode());

        Invoice invoice = Invoice.builder()
                .invoiceId(invoiceSmartId)
                .patient(patient)
                .branch(branch)
                .createdBy(createdBy)
                .totalAmount(request.getTotalAmount())
                .paidAmount(BigDecimal.ZERO)
                .status("UNPAID")
                .build();

        Invoice savedInvoice = invoiceRepository.save(invoice);
        return mapToDTO(savedInvoice);
    }

    @Override
    @Transactional(readOnly = true)
    @SuppressWarnings("null")
    public InvoiceDTO getInvoiceById(Long id) {
        return invoiceRepository.findById(id)
                .map(this::mapToDTO)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public InvoiceDTO getInvoiceBySmartId(String invoiceId) {
        return invoiceRepository.findByInvoiceId(invoiceId)
                .map(this::mapToDTO)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<InvoiceDTO> getAllInvoices() {
        return invoiceRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private InvoiceDTO mapToDTO(Invoice invoice) {
        return InvoiceDTO.builder()
                .id(invoice.getId())
                .invoiceId(invoice.getInvoiceId())
                .patientName(invoice.getPatient().getFirstName() + " " + invoice.getPatient().getLastName())
                .branchName(invoice.getBranch().getBranchName())
                .invoiceDate(invoice.getInvoiceDate())
                .totalAmount(invoice.getTotalAmount())
                .paidAmount(invoice.getPaidAmount())
                .status(invoice.getStatus())
                .build();
    }
}
