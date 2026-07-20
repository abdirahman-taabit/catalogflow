package com.catalogflow.dashboard.service;

import com.catalogflow.audit.dto.AuditEventResponse;
import com.catalogflow.audit.repository.AuditEventRepository;
import com.catalogflow.catalogimport.dto.ImportJobResponse;
import com.catalogflow.catalogimport.repository.ImportJobRepository;
import com.catalogflow.dashboard.dto.DashboardResponse;
import com.catalogflow.enrichment.model.SuggestionStatus;
import com.catalogflow.enrichment.repository.EnrichmentSuggestionRepository;
import com.catalogflow.product.model.EnrichmentStatus;
import com.catalogflow.product.model.Product;
import com.catalogflow.product.repository.ProductRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DashboardService {

    private final ProductRepository productRepository;
    private final EnrichmentSuggestionRepository suggestionRepository;
    private final ImportJobRepository importJobRepository;
    private final AuditEventRepository auditEventRepository;

    public DashboardService(ProductRepository productRepository,
                            EnrichmentSuggestionRepository suggestionRepository,
                            ImportJobRepository importJobRepository,
                            AuditEventRepository auditEventRepository) {
        this.productRepository = productRepository;
        this.suggestionRepository = suggestionRepository;
        this.importJobRepository = importJobRepository;
        this.auditEventRepository = auditEventRepository;
    }

    @Transactional(readOnly = true)
    public DashboardResponse get() {
        List<Product> products = productRepository.findAll();
        long total = products.size();
        long needsReview = products.stream().filter(product -> product.getQualityScore() < 80).count();
        long approved = suggestionRepository.countByStatus(SuggestionStatus.APPROVED);
        int average = total == 0 ? 0 : (int) Math.round(products.stream()
                .mapToInt(Product::getQualityScore).average().orElse(0));
        long healthy = products.stream().filter(product -> product.getQualityScore() >= 80).count();
        long watch = products.stream().filter(product -> product.getQualityScore() >= 60 && product.getQualityScore() < 80).count();
        long critical = products.stream().filter(product -> product.getQualityScore() < 60).count();

        List<ImportJobResponse> imports = importJobRepository.findTop5ByOrderByCreatedAtDesc().stream()
                .map(job -> ImportJobResponse.from(job, List.of()))
                .toList();
        List<AuditEventResponse> activity = auditEventRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(0, 6))
                .map(AuditEventResponse::from)
                .getContent();
        return new DashboardResponse(total, needsReview,
                suggestionRepository.countByStatus(SuggestionStatus.PENDING), approved, average,
                new DashboardResponse.QualityOverview(healthy, watch, critical), imports, activity);
    }
}

