package com.catalogflow.audit.service;

import com.catalogflow.audit.dto.AuditEventResponse;
import com.catalogflow.audit.model.AuditEvent;
import com.catalogflow.audit.model.AuditEventType;
import com.catalogflow.audit.repository.AuditEventRepository;
import com.catalogflow.common.PagedResponse;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class AuditService {

    private final AuditEventRepository repository;
    public AuditService(AuditEventRepository repository) {
        this.repository = repository;
    }

    public void record(UUID productId, AuditEventType type, Object previousValues, Object newValues) {
        repository.save(new AuditEvent(productId, type, toJson(previousValues), toJson(newValues)));
    }

    public List<AuditEventResponse> forProduct(UUID productId) {
        return repository.findByProductIdOrderByCreatedAtDesc(productId).stream()
                .map(AuditEventResponse::from)
                .toList();
    }

    public PagedResponse<AuditEventResponse> activity(int page, int size) {
        return PagedResponse.from(repository.findAllByOrderByCreatedAtDesc(PageRequest.of(page, size))
                .map(AuditEventResponse::from));
    }

    private String toJson(Object value) {
        if (value == null) {
            return null;
        }
        if (value instanceof Map<?, ?> map) {
            return map.entrySet().stream()
                    .map(entry -> quote(String.valueOf(entry.getKey())) + ":" + quote(String.valueOf(entry.getValue())))
                    .collect(java.util.stream.Collectors.joining(",", "{", "}"));
        }
        return quote(String.valueOf(value));
    }

    private String quote(String value) {
        return "\"" + value.replace("\\", "\\\\").replace("\"", "\\\"") + "\"";
    }
}
