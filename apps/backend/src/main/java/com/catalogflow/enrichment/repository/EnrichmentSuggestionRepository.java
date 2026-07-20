package com.catalogflow.enrichment.repository;

import com.catalogflow.enrichment.model.EnrichmentSuggestion;
import com.catalogflow.enrichment.model.SuggestionStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface EnrichmentSuggestionRepository extends JpaRepository<EnrichmentSuggestion, UUID> {
    Optional<EnrichmentSuggestion> findFirstByProductIdAndStatusOrderByCreatedAtDesc(UUID productId, SuggestionStatus status);
    List<EnrichmentSuggestion> findByProductIdOrderByCreatedAtDesc(UUID productId);
    long countByStatus(SuggestionStatus status);
}

