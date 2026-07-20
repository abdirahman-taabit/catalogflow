package com.catalogflow.enrichment.dto;

import com.catalogflow.enrichment.model.EnrichmentSuggestion;
import com.catalogflow.enrichment.model.SuggestionStatus;

import java.time.Instant;
import java.util.UUID;

public record SuggestionResponse(
        UUID id,
        UUID productId,
        String suggestedTitle,
        String suggestedDescription,
        String suggestedCategory,
        String suggestedKeywords,
        int confidenceScore,
        String explanation,
        SuggestionStatus status,
        Instant createdAt,
        Instant reviewedAt
) {
    public static SuggestionResponse from(EnrichmentSuggestion suggestion) {
        return new SuggestionResponse(
                suggestion.getId(), suggestion.getProduct().getId(), suggestion.getSuggestedTitle(),
                suggestion.getSuggestedDescription(), suggestion.getSuggestedCategory(),
                suggestion.getSuggestedKeywords(), suggestion.getConfidenceScore(),
                suggestion.getExplanation(), suggestion.getStatus(), suggestion.getCreatedAt(),
                suggestion.getReviewedAt());
    }
}

