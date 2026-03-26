package com.hospital.laboratory.service.api;

import com.hospital.laboratory.dto.LabOrderDTO;
import com.hospital.laboratory.dto.CreateLabOrderRequest;
import java.util.List;

public interface LabOrderService {
    LabOrderDTO createLabOrder(CreateLabOrderRequest request);
    LabOrderDTO getLabOrderById(Long id);
    LabOrderDTO getLabOrderBySmartId(String labOrderId);
    List<LabOrderDTO> getAllLabOrders();
}
