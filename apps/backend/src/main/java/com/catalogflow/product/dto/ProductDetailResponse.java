package com.catalogflow.product.dto;

import com.catalogflow.enrichment.dto.SuggestionResponse;
import com.catalogflow.product.model.EnrichmentStatus;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record ProductDetailResponse(
        UUID id,
        String sku,
        String title,
        String description,
        String category,
        String keywords,
        int qualityScore,
        EnrichmentStatus status,
        List<String> problems,
        SuggestionResponse suggestion,
        Instant createdAt,
        Instant updatedAt
) {
}

