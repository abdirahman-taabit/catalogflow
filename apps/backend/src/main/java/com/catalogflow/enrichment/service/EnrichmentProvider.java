package com.catalogflow.enrichment.service;

import com.catalogflow.enrichment.model.EnrichmentSuggestion;
import com.catalogflow.product.model.Product;

public interface EnrichmentProvider {
    EnrichmentSuggestion generateSuggestion(Product product);
}

