package com.catalogflow.product.dto;

import com.catalogflow.product.model.EnrichmentStatus;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record ProductSummaryResponse(
        UUID id,
        String sku,
        String title,
        String category,
        int qualityScore,
        EnrichmentStatus status,
        List<String> problems,
        Instant updatedAt
) {
}

