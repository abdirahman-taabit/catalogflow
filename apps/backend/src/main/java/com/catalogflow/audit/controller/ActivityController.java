package com.catalogflow.audit.controller;

import com.catalogflow.audit.dto.AuditEventResponse;
import com.catalogflow.audit.service.AuditService;
import com.catalogflow.common.PagedResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/activity")
public class ActivityController {

    private final AuditService auditService;

    public ActivityController(AuditService auditService) {
        this.auditService = auditService;
    }

    @GetMapping
    public PagedResponse<AuditEventResponse> activity(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return auditService.activity(Math.max(page, 0), Math.min(Math.max(size, 1), 100));
    }
}

