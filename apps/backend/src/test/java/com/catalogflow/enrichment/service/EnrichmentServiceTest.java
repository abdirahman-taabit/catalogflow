package com.catalogflow.enrichment.service;

import com.catalogflow.audit.model.AuditEventType;
import com.catalogflow.audit.service.AuditService;
import com.catalogflow.enrichment.dto.SuggestionResponse;
import com.catalogflow.enrichment.model.EnrichmentSuggestion;
import com.catalogflow.enrichment.repository.EnrichmentSuggestionRepository;
import com.catalogflow.product.model.EnrichmentStatus;
import com.catalogflow.product.model.Product;
import com.catalogflow.product.repository.ProductRepository;
import com.catalogflow.product.service.ProductQualityService;
import com.catalogflow.product.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EnrichmentServiceTest {

    @Mock private EnrichmentProvider provider;
    @Mock private EnrichmentSuggestionRepository suggestionRepository;
    @Mock private ProductRepository productRepository;
    @Mock private ProductService productService;
    @Mock private AuditService auditService;

    private EnrichmentService service;
    private Product product;
    private EnrichmentSuggestion suggestion;

    @BeforeEach
    void setUp() {
        product = new Product("CAM-100", "COMPACT CAMERA", "Short description", "Photography", "camera",
                55, EnrichmentStatus.NEEDS_REVIEW);
        suggestion = new EnrichmentSuggestion(product, "Compact Camera",
                "Compact Camera is a practical photography product designed for reliable everyday travel use.",
                "Photography", "compact,camera,photography", 85, "Rules applied: normalized title casing.");
        service = new EnrichmentService(provider, suggestionRepository, productRepository, productService,
                new ProductQualityService(), auditService);
    }

    @Test
    void generatesAndAuditsANewSuggestion() {
        when(productService.getRequired(product.getId())).thenReturn(product);
        when(suggestionRepository.findFirstByProductIdAndStatusOrderByCreatedAtDesc(eq(product.getId()), any()))
                .thenReturn(Optional.empty());
        when(provider.generateSuggestion(product)).thenReturn(suggestion);
        when(suggestionRepository.save(suggestion)).thenReturn(suggestion);

        SuggestionResponse result = service.generate(product.getId());

        assertThat(result.status().name()).isEqualTo("PENDING");
        assertThat(product.getEnrichmentStatus()).isEqualTo(EnrichmentStatus.SUGGESTION_PENDING);
        verify(auditService).record(eq(product.getId()), eq(AuditEventType.SUGGESTION_CREATED), eq(null), any());
    }

    @Test
    void approvalAppliesSuggestedValuesAndWritesAuditHistory() {
        when(suggestionRepository.findById(suggestion.getId())).thenReturn(Optional.of(suggestion));

        service.approve(suggestion.getId());

        assertThat(product.getTitle()).isEqualTo("Compact Camera");
        assertThat(product.getEnrichmentStatus()).isEqualTo(EnrichmentStatus.ENRICHED);
        assertThat(suggestion.getStatus().name()).isEqualTo("APPROVED");
        verify(productRepository).save(product);
        verify(auditService).record(eq(product.getId()), eq(AuditEventType.SUGGESTION_APPROVED), any(), any());
    }

    @Test
    void rejectionKeepsOriginalValuesAndWritesAuditHistory() {
        when(suggestionRepository.findById(suggestion.getId())).thenReturn(Optional.of(suggestion));

        service.reject(suggestion.getId());

        assertThat(product.getTitle()).isEqualTo("COMPACT CAMERA");
        assertThat(product.getEnrichmentStatus()).isEqualTo(EnrichmentStatus.REJECTED);
        assertThat(suggestion.getStatus().name()).isEqualTo("REJECTED");
        verify(productRepository).save(product);
        verify(auditService).record(eq(product.getId()), eq(AuditEventType.SUGGESTION_REJECTED), any(), any());
    }
}
