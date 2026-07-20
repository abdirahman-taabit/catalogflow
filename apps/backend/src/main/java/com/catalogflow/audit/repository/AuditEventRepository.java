package com.catalogflow.audit.repository;

import com.catalogflow.audit.model.AuditEvent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AuditEventRepository extends JpaRepository<AuditEvent, UUID> {
    List<AuditEvent> findByProductIdOrderByCreatedAtDesc(UUID productId);
    Page<AuditEvent> findAllByOrderByCreatedAtDesc(Pageable pageable);
}

