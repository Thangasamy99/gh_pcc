package com.hospital.billing.service.api;

import com.hospital.billing.dto.InvoiceDTO;
import com.hospital.billing.dto.CreateInvoiceRequest;
import java.util.List;

public interface InvoiceService {
    InvoiceDTO createInvoice(CreateInvoiceRequest request);
    InvoiceDTO getInvoiceById(Long id);
    InvoiceDTO getInvoiceBySmartId(String invoiceId);
    List<InvoiceDTO> getAllInvoices();
}
