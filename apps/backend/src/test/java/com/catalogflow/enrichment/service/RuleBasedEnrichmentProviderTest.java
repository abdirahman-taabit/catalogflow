package com.catalogflow.enrichment.service;

import com.catalogflow.enrichment.model.EnrichmentSuggestion;
import com.catalogflow.product.model.EnrichmentStatus;
import com.catalogflow.product.model.Product;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class RuleBasedEnrichmentProviderTest {

    private final RuleBasedEnrichmentProvider provider = new RuleBasedEnrichmentProvider();

    @Test
    void createsATransparentDeterministicSuggestion() {
        Product product = new Product("KEY-1042", "WIRELESS MECHANICAL KEYBOARD", "Compact keyboard", "", "",
                42, EnrichmentStatus.NEEDS_REVIEW);

        EnrichmentSuggestion suggestion = provider.generateSuggestion(product);

        assertThat(suggestion.getSuggestedTitle()).isEqualTo("Wireless Mechanical Keyboard");
        assertThat(suggestion.getSuggestedCategory()).isEqualTo("Computer accessories");
        assertThat(suggestion.getSuggestedKeywords()).contains("wireless", "keyboard");
        assertThat(suggestion.getSuggestedDescription()).hasSizeGreaterThan(60);
        assertThat(suggestion.getConfidenceScore()).isBetween(80, 95);
        assertThat(suggestion.getExplanation()).contains("normalized title casing", "matched category");
    }
}
