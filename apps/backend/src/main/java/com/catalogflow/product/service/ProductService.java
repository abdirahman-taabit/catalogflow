package com.catalogflow.product.service;

import com.catalogflow.common.NotFoundException;
import com.catalogflow.common.PagedResponse;
import com.catalogflow.enrichment.dto.SuggestionResponse;
import com.catalogflow.enrichment.model.EnrichmentSuggestion;
import com.catalogflow.enrichment.repository.EnrichmentSuggestionRepository;
import com.catalogflow.product.dto.ProductDetailResponse;
import com.catalogflow.product.dto.ProductSummaryResponse;
import com.catalogflow.product.model.EnrichmentStatus;
import com.catalogflow.product.model.Product;
import com.catalogflow.product.repository.ProductRepository;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

@Service
public class ProductService {

    private static final Set<String> SORT_FIELDS = Set.of("title", "sku", "qualityScore", "category", "updatedAt");

    private final ProductRepository productRepository;
    private final EnrichmentSuggestionRepository suggestionRepository;
    private final ProductQualityService qualityService;

    public ProductService(ProductRepository productRepository,
                          EnrichmentSuggestionRepository suggestionRepository,
                          ProductQualityService qualityService) {
        this.productRepository = productRepository;
        this.suggestionRepository = suggestionRepository;
        this.qualityService = qualityService;
    }

    @Transactional(readOnly = true)
    public PagedResponse<ProductSummaryResponse> search(String search, String category, String status,
                                                        String sort, String direction, int page, int size) {
        String sortField = SORT_FIELDS.contains(sort) ? sort : "qualityScore";
        Sort.Direction sortDirection = "desc".equalsIgnoreCase(direction) ? Sort.Direction.DESC : Sort.Direction.ASC;
        PageRequest pageable = PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 100),
                Sort.by(sortDirection, sortField));

        Specification<Product> specification = (root, query, builder) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (search != null && !search.isBlank()) {
                String pattern = "%" + search.trim().toLowerCase(Locale.ROOT) + "%";
                predicates.add(builder.or(
                        builder.like(builder.lower(root.get("title")), pattern),
                        builder.like(builder.lower(root.get("sku")), pattern)
                ));
            }
            if (category != null && !category.isBlank() && !"all".equalsIgnoreCase(category)) {
                predicates.add(builder.equal(builder.lower(root.get("category")), category.toLowerCase(Locale.ROOT)));
            }
            if (status != null && !status.isBlank() && !"all".equalsIgnoreCase(status)) {
                try {
                    predicates.add(builder.equal(root.get("enrichmentStatus"),
                            EnrichmentStatus.valueOf(status.toUpperCase(Locale.ROOT))));
                } catch (IllegalArgumentException ignored) {
                    predicates.add(builder.disjunction());
                }
            }
            return builder.and(predicates.toArray(Predicate[]::new));
        };

        Page<ProductSummaryResponse> products = productRepository.findAll(specification, pageable)
                .map(this::toSummary);
        return PagedResponse.from(products);
    }

    @Transactional(readOnly = true)
    public ProductDetailResponse get(UUID id) {
        Product product = getRequired(id);
        SuggestionResponse latest = suggestionRepository.findByProductIdOrderByCreatedAtDesc(id).stream()
                .findFirst()
                .map(SuggestionResponse::from)
                .orElse(null);
        return toDetail(product, latest);
    }

    public Product getRequired(UUID id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Product not found."));
    }

    public ProductSummaryResponse toSummary(Product product) {
        return new ProductSummaryResponse(product.getId(), product.getSku(), product.getTitle(),
                product.getCategory(), product.getQualityScore(), product.getEnrichmentStatus(),
                qualityService.problems(product), product.getUpdatedAt());
    }

    public ProductDetailResponse toDetail(Product product, SuggestionResponse suggestion) {
        return new ProductDetailResponse(product.getId(), product.getSku(), product.getTitle(),
                product.getDescription(), product.getCategory(), product.getKeywords(), product.getQualityScore(),
                product.getEnrichmentStatus(), qualityService.problems(product), suggestion,
                product.getCreatedAt(), product.getUpdatedAt());
    }
}

