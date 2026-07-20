package com.catalogflow.product.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "products")
public class Product {

    @Id
    private UUID id = UUID.randomUUID();

    @Column(nullable = false, unique = true, length = 32)
    private String sku;

    @Column(nullable = false, length = 240)
    private String title;

    @Column(length = 4000)
    private String description;

    @Column(length = 120)
    private String category;

    @Column(length = 1000)
    private String keywords;

    @Column(name = "quality_score", nullable = false)
    private int qualityScore;

    @Enumerated(EnumType.STRING)
    @Column(name = "enrichment_status", nullable = false, length = 32)
    private EnrichmentStatus enrichmentStatus;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected Product() {
    }

    public Product(String sku, String title, String description, String category, String keywords,
                   int qualityScore, EnrichmentStatus enrichmentStatus) {
        this.sku = sku;
        this.title = title;
        this.description = description;
        this.category = category;
        this.keywords = keywords;
        this.qualityScore = qualityScore;
        this.enrichmentStatus = enrichmentStatus;
        this.createdAt = Instant.now();
        this.updatedAt = this.createdAt;
    }

    public UUID getId() { return id; }
    public String getSku() { return sku; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getCategory() { return category; }
    public String getKeywords() { return keywords; }
    public int getQualityScore() { return qualityScore; }
    public EnrichmentStatus getEnrichmentStatus() { return enrichmentStatus; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }

    public void applyEnrichment(String title, String description, String category, String keywords, int qualityScore) {
        this.title = title;
        this.description = description;
        this.category = category;
        this.keywords = keywords;
        this.qualityScore = qualityScore;
        this.enrichmentStatus = EnrichmentStatus.ENRICHED;
        this.updatedAt = Instant.now();
    }

    public void markSuggestionPending() {
        this.enrichmentStatus = EnrichmentStatus.SUGGESTION_PENDING;
        this.updatedAt = Instant.now();
    }

    public void markSuggestionRejected() {
        this.enrichmentStatus = EnrichmentStatus.REJECTED;
        this.updatedAt = Instant.now();
    }
}

