package com.catalogflow.audit.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "audit_events")
public class AuditEvent {

    @Id
    private UUID id = UUID.randomUUID();

    @Column(name = "product_id")
    private UUID productId;

    @Enumerated(EnumType.STRING)
    @Column(name = "event_type", nullable = false, length = 40)
    private AuditEventType eventType;

    @Column(name = "previous_values", length = 8000)
    private String previousValues;

    @Column(name = "new_values", length = 8000)
    private String newValues;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    protected AuditEvent() {
    }

    public AuditEvent(UUID productId, AuditEventType eventType, String previousValues, String newValues) {
        this.productId = productId;
        this.eventType = eventType;
        this.previousValues = previousValues;
        this.newValues = newValues;
    }

    public UUID getId() { return id; }
    public UUID getProductId() { return productId; }
    public AuditEventType getEventType() { return eventType; }
    public String getPreviousValues() { return previousValues; }
    public String getNewValues() { return newValues; }
    public Instant getCreatedAt() { return createdAt; }
}

