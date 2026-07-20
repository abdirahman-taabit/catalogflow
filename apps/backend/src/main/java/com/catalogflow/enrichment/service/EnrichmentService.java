package com.catalogflow.enrichment.service;

import com.catalogflow.audit.model.AuditEventType;
import com.catalogflow.audit.service.AuditService;
import com.catalogflow.common.BadRequestException;
import com.catalogflow.common.NotFoundException;
import com.catalogflow.enrichment.dto.SuggestionResponse;
import com.catalogflow.enrichment.model.EnrichmentSuggestion;
import com.catalogflow.enrichment.model.SuggestionStatus;
import com.catalogflow.enrichment.repository.EnrichmentSuggestionRepository;
import com.catalogflow.product.dto.ProductDetailResponse;
import com.catalogflow.product.model.Product;
import com.catalogflow.product.repository.ProductRepository;
import com.catalogflow.product.service.ProductQualityService;
import com.catalogflow.product.service.ProductService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class EnrichmentService {

    private final EnrichmentProvider provider;
    private final EnrichmentSuggestionRepository suggestionRepository;
    private final ProductRepository productRepository;
    private final ProductService productService;
    private final ProductQualityService qualityService;
    private final AuditService auditService;

    public EnrichmentService(EnrichmentProvider provider,
                             EnrichmentSuggestionRepository suggestionRepository,
                             ProductRepository productRepository,
                             ProductService productService,
                             ProductQualityService qualityService,
                             AuditService auditService) {
        this.provider = provider;
        this.suggestionRepository = suggestionRepository;
        this.productRepository = productRepository;
        this.productService = productService;
        this.qualityService = qualityService;
        this.auditService = auditService;
    }

    @Transactional
    public SuggestionResponse generate(UUID productId) {
        Product product = productService.getRequired(productId);
        return suggestionRepository.findFirstByProductIdAndStatusOrderByCreatedAtDesc(productId, SuggestionStatus.PENDING)
                .map(SuggestionResponse::from)
                .orElseGet(() -> {
                    EnrichmentSuggestion suggestion = suggestionRepository.save(provider.generateSuggestion(product));
                    product.markSuggestionPending();
                    productRepository.save(product);
                    auditService.record(productId, AuditEventType.SUGGESTION_CREATED, null,
                            Map.of("suggestionId", suggestion.getId(), "confidenceScore", suggestion.getConfidenceScore()));
                    return SuggestionResponse.from(suggestion);
                });
    }

    @Transactional
    public ProductDetailResponse approve(UUID suggestionId) {
        EnrichmentSuggestion suggestion = getPending(suggestionId);
        Product product = suggestion.getProduct();
        Map<String, Object> previous = values(product);
        int newQualityScore = qualityService.calculate(suggestion.getSuggestedTitle(),
                suggestion.getSuggestedDescription(), suggestion.getSuggestedCategory(), suggestion.getSuggestedKeywords());
        product.applyEnrichment(suggestion.getSuggestedTitle(), suggestion.getSuggestedDescription(),
                suggestion.getSuggestedCategory(), suggestion.getSuggestedKeywords(), newQualityScore);
        suggestion.approve();
        suggestionRepository.save(suggestion);
        productRepository.save(product);
        auditService.record(product.getId(), AuditEventType.SUGGESTION_APPROVED, previous, values(product));
        return productService.toDetail(product, SuggestionResponse.from(suggestion));
    }

    @Transactional
    public ProductDetailResponse reject(UUID suggestionId) {
        EnrichmentSuggestion suggestion = getPending(suggestionId);
        Product product = suggestion.getProduct();
        suggestion.reject();
        product.markSuggestionRejected();
        suggestionRepository.save(suggestion);
        productRepository.save(product);
        auditService.record(product.getId(), AuditEventType.SUGGESTION_REJECTED,
                Map.of("suggestionId", suggestionId), Map.of("status", "REJECTED"));
        return productService.toDetail(product, SuggestionResponse.from(suggestion));
    }

    private EnrichmentSuggestion getPending(UUID suggestionId) {
        EnrichmentSuggestion suggestion = suggestionRepository.findById(suggestionId)
                .orElseThrow(() -> new NotFoundException("Suggestion not found."));
        if (suggestion.getStatus() != SuggestionStatus.PENDING) {
            throw new BadRequestException("This suggestion has already been reviewed.");
        }
        return suggestion;
    }

    private Map<String, Object> values(Product product) {
        Map<String, Object> values = new LinkedHashMap<>();
        values.put("title", product.getTitle());
        values.put("description", product.getDescription());
        values.put("category", product.getCategory());
        values.put("keywords", product.getKeywords());
        values.put("qualityScore", product.getQualityScore());
        return values;
    }
}

