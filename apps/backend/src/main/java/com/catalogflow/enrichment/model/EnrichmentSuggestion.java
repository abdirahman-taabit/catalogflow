package com.catalogflow.enrichment.model;

import com.catalogflow.product.model.Product;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "enrichment_suggestions")
public class EnrichmentSuggestion {

    @Id
    private UUID id = UUID.randomUUID();

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "suggested_title", length = 240)
    private String suggestedTitle;

    @Column(name = "suggested_description", length = 4000)
    private String suggestedDescription;

    @Column(name = "suggested_category", length = 120)
    private String suggestedCategory;

    @Column(name = "suggested_keywords", length = 1000)
    private String suggestedKeywords;

    @Column(name = "confidence_score", nullable = false)
    private int confidenceScore;

    @Column(nullable = false, length = 4000)
    private String explanation;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 24)
    private SuggestionStatus status = SuggestionStatus.PENDING;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "reviewed_at")
    private Instant reviewedAt;

    protected EnrichmentSuggestion() {
    }

    public EnrichmentSuggestion(Product product, String suggestedTitle, String suggestedDescription,
                                String suggestedCategory, String suggestedKeywords, int confidenceScore,
                                String explanation) {
        this.product = product;
        this.suggestedTitle = suggestedTitle;
        this.suggestedDescription = suggestedDescription;
        this.suggestedCategory = suggestedCategory;
        this.suggestedKeywords = suggestedKeywords;
        this.confidenceScore = confidenceScore;
        this.explanation = explanation;
    }

    public UUID getId() { return id; }
    public Product getProduct() { return product; }
    public String getSuggestedTitle() { return suggestedTitle; }
    public String getSuggestedDescription() { return suggestedDescription; }
    public String getSuggestedCategory() { return suggestedCategory; }
    public String getSuggestedKeywords() { return suggestedKeywords; }
    public int getConfidenceScore() { return confidenceScore; }
    public String getExplanation() { return explanation; }
    public SuggestionStatus getStatus() { return status; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getReviewedAt() { return reviewedAt; }

    public void approve() {
        status = SuggestionStatus.APPROVED;
        reviewedAt = Instant.now();
    }

    public void reject() {
        status = SuggestionStatus.REJECTED;
        reviewedAt = Instant.now();
    }
}

