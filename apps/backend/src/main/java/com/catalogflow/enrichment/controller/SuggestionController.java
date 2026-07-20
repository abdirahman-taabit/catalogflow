package com.catalogflow.enrichment.controller;

import com.catalogflow.enrichment.service.EnrichmentService;
import com.catalogflow.product.dto.ProductDetailResponse;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/suggestions")
public class SuggestionController {

    private final EnrichmentService enrichmentService;

    public SuggestionController(EnrichmentService enrichmentService) {
        this.enrichmentService = enrichmentService;
    }

    @PostMapping("/{id}/approve")
    public ProductDetailResponse approve(@PathVariable UUID id) {
        return enrichmentService.approve(id);
    }

    @PostMapping("/{id}/reject")
    public ProductDetailResponse reject(@PathVariable UUID id) {
        return enrichmentService.reject(id);
    }
}

