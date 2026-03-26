package com.hospital.audit.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class AuditLogService {

    /**
     * Log an action asynchronously so it never blocks the main request.
     */
    @Async
    public void logAction(String module,
            String action,
            String resourceType,
            String resourceId,
            String details,
            Long userId) {
        log.info("[AUDIT] user={} | module={} | action={} | resource={}:{} | detail={}",
                userId, module, action, resourceType, resourceId, details);
    }

    /**
     * Extended form used by the branch/user service implementations.
     */
    @Async
    public void logActivity(Long userId,
            String action,
            String resourceType,
            String resourceId,
            String oldValue,
            String newValue,
            String status,
            String details) {
        log.info("[AUDIT] user={} | action={} | resource={}:{} | old='{}' | new='{}' | status={} | detail={}",
                userId, action, resourceType, resourceId, oldValue, newValue, status, details);
    }
}
