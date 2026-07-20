package com.catalogflow.audit.dto;

import com.catalogflow.audit.model.AuditEvent;
import com.catalogflow.audit.model.AuditEventType;

import java.time.Instant;
import java.util.UUID;

public record AuditEventResponse(
        UUID id,
        UUID productId,
        AuditEventType eventType,
        String previousValues,
        String newValues,
        Instant createdAt
) {
    public static AuditEventResponse from(AuditEvent event) {
        return new AuditEventResponse(event.getId(), event.getProductId(), event.getEventType(),
                event.getPreviousValues(), event.getNewValues(), event.getCreatedAt());
    }
}

