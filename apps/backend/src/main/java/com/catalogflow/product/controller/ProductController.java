package com.catalogflow.product.controller;

import com.catalogflow.audit.dto.AuditEventResponse;
import com.catalogflow.audit.service.AuditService;
import com.catalogflow.common.PagedResponse;
import com.catalogflow.enrichment.dto.SuggestionResponse;
import com.catalogflow.enrichment.service.EnrichmentService;
import com.catalogflow.product.dto.ProductDetailResponse;
import com.catalogflow.product.dto.ProductSummaryResponse;
import com.catalogflow.product.service.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;
    private final EnrichmentService enrichmentService;
    private final AuditService auditService;

    public ProductController(ProductService productService, EnrichmentService enrichmentService,
                             AuditService auditService) {
        this.productService = productService;
        this.enrichmentService = enrichmentService;
        this.auditService = auditService;
    }

    @GetMapping
    public PagedResponse<ProductSummaryResponse> list(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "all") String category,
            @RequestParam(defaultValue = "all") String status,
            @RequestParam(defaultValue = "qualityScore") String sort,
            @RequestParam(defaultValue = "asc") String direction,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return productService.search(search, category, status, sort, direction, page, size);
    }

    @GetMapping("/{id}")
    public ProductDetailResponse get(@PathVariable UUID id) {
        return productService.get(id);
    }

    @PostMapping("/{id}/suggestions")
    @ResponseStatus(HttpStatus.CREATED)
    public SuggestionResponse generateSuggestion(@PathVariable UUID id) {
        return enrichmentService.generate(id);
    }

    @GetMapping("/{id}/audit-events")
    public List<AuditEventResponse> auditEvents(@PathVariable UUID id) {
        productService.getRequired(id);
        return auditService.forProduct(id);
    }
}

